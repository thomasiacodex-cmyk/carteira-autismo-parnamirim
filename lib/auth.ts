"use server";

import { db, hashPassword, verifyPassword } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { generateId } from "@/lib/utils";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { enviarEmailVerificacao, enviarEmailRecuperacaoSenha } from "@/lib/email";
import { audit } from "@/lib/audit";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function login(email: string, senha: string) {
  if (!email || !senha) {
    return { success: false as const, error: "Preencha todos os campos" };
  }

  const result = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email.trim().toLowerCase()))
    .limit(1);

  if (result.length === 0) {
    audit("user.login_failed", { details: { email: email.trim().toLowerCase() } });
    return { success: false as const, error: "E-mail ou senha incorretos" };
  }

  const user = result[0];

  if (!verifyPassword(senha, user.senha)) {
    audit("user.login_failed", { userId: user.id });
    return { success: false as const, error: "E-mail ou senha incorretos" };
  }

  await createSession(user.id);
  audit("user.login", { userId: user.id });

  return { success: true as const, userId: user.id };
}

export async function registrar(data: {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  laudoUrl?: string;
}) {
  if (!data.nome || !data.email || !data.cpf || !data.senha) {
    return { success: false as const, error: "Preencha todos os campos" };
  }

  if (data.senha.length < 6) {
    return { success: false as const, error: "Senha deve ter pelo menos 6 caracteres" };
  }

  const emailNormalized = data.email.trim().toLowerCase();

  // Check if email already exists
  const existing = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, emailNormalized))
    .limit(1);

  if (existing.length > 0) {
    return { success: false as const, error: "E-mail já cadastrado" };
  }

  // Check if CPF already exists
  const existingCpf = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.cpf, data.cpf))
    .limit(1);

  if (existingCpf.length > 0) {
    return { success: false as const, error: "CPF já cadastrado" };
  }

  const id = generateId();
  const senhaHash = hashPassword(data.senha);

  // Generate email verification token
  const verifToken = randomBytes(32).toString("hex");
  const verifExpira = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await db.insert(usuarios).values({
    id,
    nome: data.nome.trim(),
    email: emailNormalized,
    cpf: data.cpf,
    senha: senhaHash,
    emailVerificado: false,
    emailVerifToken: verifToken,
    emailVerifExpira: verifExpira,
    laudoUrl: data.laudoUrl || null,
  });

  // Send verification email (non-blocking)
  enviarEmailVerificacao(emailNormalized, data.nome.trim(), verifToken).catch(
    (err) => console.error("[EMAIL] Erro ao enviar verificação:", err),
  );

  await createSession(id);
  audit("user.register", { userId: id });

  return { success: true as const, userId: id };
}

export async function logout() {
  const session = await getSession();
  if (session) {
    audit("user.logout", { userId: session.userId });
  }
  await deleteSession();
}

export async function getUsuarioLogado() {
  const session = await getSession();
  if (!session) return null;

  const result = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, session.userId))
    .limit(1);

  return result[0] || null;
}

export async function verificarSenhaAdmin(senha: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  // Constant-time comparison using crypto.timingSafeEqual
  const a = Buffer.from(senha);
  const b = Buffer.from(adminPassword);

  // Pad both to same length to prevent timing attacks based on length
  const maxLen = Math.max(a.length, b.length);
  const aPadded = Buffer.alloc(maxLen);
  const bPadded = Buffer.alloc(maxLen);
  a.copy(aPadded);
  b.copy(bPadded);

  try {
    const timingSafeEq = require("crypto").timingSafeEqual;
    const valid = timingSafeEq(aPadded, bPadded);

    if (valid) {
      audit("admin.login");
    } else {
      audit("admin.login_failed");
    }
    return valid;
  } catch {
    audit("admin.login_failed");
    return false;
  }
}

export async function loginAdmin(senha: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { success: false as const, error: "Admin não configurado" };
  }

  if (!senha) {
    return { success: false as const, error: "Informe a senha de administrador" };
  }

  const a = Buffer.from(senha);
  const b = Buffer.from(adminPassword);
  const maxLen = Math.max(a.length, b.length);
  const aPadded = Buffer.alloc(maxLen);
  const bPadded = Buffer.alloc(maxLen);
  a.copy(aPadded);
  b.copy(bPadded);

  try {
    const timingSafeEq = require("crypto").timingSafeEqual;
    const valid = timingSafeEq(aPadded, bPadded);

    if (!valid) {
      audit("admin.login_failed");
      return { success: false as const, error: "Senha de administrador incorreta" };
    }

    await createSession("admin", true);
    audit("admin.login");
    return { success: true as const };
  } catch {
    audit("admin.login_failed");
    return { success: false as const, error: "Erro ao verificar senha" };
  }
}

export async function atualizarPerfil(data: {
  nome: string;
  email: string;
  senhaAtual?: string;
  novaSenha?: string;
}) {
  const usuario = await getUsuarioLogado();
  if (!usuario) {
    return { success: false as const, error: "Não autenticado" };
  }

  if (!data.nome || !data.email) {
    return { success: false as const, error: "Nome e e-mail são obrigatórios" };
  }

  const emailNormalized = data.email.trim().toLowerCase();

  // Check if email is taken by another user
  if (emailNormalized !== usuario.email) {
    const existing = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, emailNormalized))
      .limit(1);
    if (existing.length > 0) {
      return { success: false as const, error: "E-mail já está em uso por outra conta" };
    }
  }

  const updates: Record<string, unknown> = {
    nome: data.nome.trim(),
    email: emailNormalized,
  };

  // If email changed, require re-verification
  if (emailNormalized !== usuario.email) {
    const verifToken = randomBytes(32).toString("hex");
    const verifExpira = Date.now() + 24 * 60 * 60 * 1000;
    updates.emailVerificado = false;
    updates.emailVerifToken = verifToken;
    updates.emailVerifExpira = verifExpira;
    enviarEmailVerificacao(emailNormalized, data.nome.trim(), verifToken).catch(
      (err) => console.error("[EMAIL] Erro ao enviar verificação:", err),
    );
  }

  // Password change
  if (data.novaSenha) {
    if (!data.senhaAtual) {
      return { success: false as const, error: "Informe a senha atual para alterar" };
    }
    if (!verifyPassword(data.senhaAtual, usuario.senha)) {
      return { success: false as const, error: "Senha atual incorreta" };
    }
    if (data.novaSenha.length < 6) {
      return { success: false as const, error: "Nova senha deve ter pelo menos 6 caracteres" };
    }
    updates.senha = hashPassword(data.novaSenha);
  }

  await db.update(usuarios).set(updates).where(eq(usuarios.id, usuario.id));
  audit("user.update_profile", { userId: usuario.id });

  return { success: true as const };
}

export async function solicitarRecuperacaoSenha(data: { cpf: string; email: string }) {
  if (!data.cpf || !data.email) {
    return { success: false as const, error: "Preencha todos os campos" };
  }

  const emailNormalized = data.email.trim().toLowerCase();

  const result = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.cpf, data.cpf))
    .limit(1);

  // Always return success to prevent user enumeration
  if (result.length === 0) {
    return { success: true as const };
  }

  const user = result[0];
  if (user.email !== emailNormalized) {
    return { success: true as const };
  }

  const token = randomBytes(32).toString("hex");
  const expira = Date.now() + 60 * 60 * 1000; // 1 hour

  await db
    .update(usuarios)
    .set({ resetSenhaToken: token, resetSenhaExpira: expira })
    .where(eq(usuarios.id, user.id));

  enviarEmailRecuperacaoSenha(user.email, user.nome, token).catch((err) =>
    console.error("[EMAIL] Erro ao enviar recuperação:", err),
  );

  audit("user.password_reset_request", { userId: user.id });

  return { success: true as const };
}

export async function redefinirSenha(data: { token: string; novaSenha: string }) {
  if (!data.token || !data.novaSenha) {
    return { success: false as const, error: "Dados inválidos" };
  }

  if (data.novaSenha.length < 6) {
    return { success: false as const, error: "Nova senha deve ter pelo menos 6 caracteres" };
  }

  const result = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.resetSenhaToken, data.token))
    .limit(1);

  if (result.length === 0) {
    return { success: false as const, error: "Link de recuperação inválido ou expirado" };
  }

  const user = result[0];

  if (!user.resetSenhaExpira || user.resetSenhaExpira < Date.now()) {
    return { success: false as const, error: "Link de recuperação expirado. Solicite novamente." };
  }

  const senhaHash = hashPassword(data.novaSenha);
  await db
    .update(usuarios)
    .set({
      senha: senhaHash,
      resetSenhaToken: null,
      resetSenhaExpira: null,
    })
    .where(eq(usuarios.id, user.id));

  audit("user.password_reset", { userId: user.id });

  return { success: true as const };
}

export async function verificarEmail(token: string) {
  if (!token) return { success: false as const, error: "Token inválido" };

  const result = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.emailVerifToken, token))
    .limit(1);

  if (result.length === 0) {
    return { success: false as const, error: "Token de verificação inválido" };
  }

  const user = result[0];

  if (!user.emailVerifExpira || user.emailVerifExpira < Date.now()) {
    return { success: false as const, error: "Token de verificação expirado" };
  }

  await db
    .update(usuarios)
    .set({
      emailVerificado: true,
      emailVerifToken: null,
      emailVerifExpira: null,
    })
    .where(eq(usuarios.id, user.id));

  audit("user.email_verified", { userId: user.id });

  return { success: true as const };
}

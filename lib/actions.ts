"use server";

import { db } from "@/lib/db";
import { carteiras, usuarios } from "@/lib/schema";
import { generateId } from "@/lib/utils";
import { fullFormSchema } from "@/lib/validations";
import { format, addYears } from "date-fns";
import { eq, and, ne } from "drizzle-orm";
import { getUsuarioLogado } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { enviarEmailStatusCarteira } from "@/lib/email";
import { getSession } from "@/lib/session";

export async function criarCarteira(formData: Record<string, string>) {
  try {
    const parsed = fullFormSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false as const,
        error: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;
    const usuario = await getUsuarioLogado();

    // Block duplicate active carteira for same CPF
    const existingActive = await db
      .select({ id: carteiras.id })
      .from(carteiras)
      .where(
        and(
          eq(carteiras.cpf, data.cpf),
          ne(carteiras.status, "negada"),
        ),
      )
      .limit(1);

    if (existingActive.length > 0) {
      return {
        success: false as const,
        error: { _form: ["Já existe uma carteira ativa ou em análise para este CPF."] },
      };
    }

    const id = generateId();
    const hoje = new Date();
    const dataEmissao = format(hoje, "yyyy-MM-dd");
    const dataValidade = format(addYears(hoje, 5), "yyyy-MM-dd");

    await db.insert(carteiras).values({
      id,
      userId: usuario?.id || null,
      nomeAcompanhante: data.nomeAcompanhante || null,
      nomeCompleto: data.nomeCompleto.trim(),
      cpf: data.cpf,
      dataNascimento: data.dataNascimento,
      fotoUrl: formData.fotoUrl || null,
      cpfDocUrl: formData.cpfDocUrl || null,
      rgDocUrl: formData.rgDocUrl || null,
      laudoUrl: formData.laudoUrl || null,
      cid: data.cid.toUpperCase(),
      crmMedico: data.crmMedico.trim(),
      rua: data.rua.trim(),
      numero: data.numero.trim(),
      complemento: data.complemento?.trim() || null,
      bairro: data.bairro.trim(),
      cep: data.cep,
      cidade: data.cidade || "Parnamirim",
      estado: "RN",
      comprovanteUrl: formData.comprovanteUrl || null,
      telefone: data.telefone,
      nomeMae: data.nomeMae?.trim() || null,
      localNascimento: data.localNascimento?.trim() || null,
      tipoSanguineo: data.tipoSanguineo || null,
      status: "em_analise",
      dataEmissao,
      dataValidade,
    });

    audit("carteira.create", { userId: usuario?.id, details: { carteiraId: id } });

    return { success: true as const, id };
  } catch (err) {
    console.error("Erro ao criar carteira:", err);
    return {
      success: false as const,
      error: { _form: ["Erro interno ao emitir carteira. Tente novamente."] },
    };
  }
}

export async function buscarCarteira(id: string) {
  try {
    if (!id || typeof id !== "string") return null;
    const result = await db
      .select()
      .from(carteiras)
      .where(eq(carteiras.id, id))
      .limit(1);
    return result[0] || null;
  } catch (err) {
    console.error("Erro ao buscar carteira:", err);
    return null;
  }
}

export async function buscarCarteiraProtegida(id: string) {
  try {
    if (!id || typeof id !== "string") return { carteira: null, allowed: false };
    const result = await db
      .select()
      .from(carteiras)
      .where(eq(carteiras.id, id))
      .limit(1);
    if (result.length === 0) return { carteira: null, allowed: false };
    const carteira = result[0];
    const usuario = await getUsuarioLogado();
    if (!usuario) return { carteira: null, allowed: false };
    // Owner or admin can view
    const allowed = carteira.userId === usuario.id;
    return { carteira: allowed ? carteira : null, allowed };
  } catch (err) {
    console.error("Erro ao buscar carteira protegida:", err);
    return { carteira: null, allowed: false };
  }
}

export async function listarCarteiras() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      audit("carteira.list_unauthorized");
      return [];
    }
    const result = await db.select().from(carteiras).all();
    audit("carteira.list", { details: { count: result.length } });
    return result;
  } catch (err) {
    console.error("Erro ao listar carteiras:", err);
    return [];
  }
}

export async function listarCarteirasDoUsuario(userId: string) {
  try {
    if (!userId) return [];
    return await db
      .select()
      .from(carteiras)
      .where(eq(carteiras.userId, userId))
      .all();
  } catch (err) {
    console.error("Erro ao listar carteiras do usuário:", err);
    return [];
  }
}

export async function atualizarStatusCarteira(id: string, status: "emitida" | "em_analise" | "negada", motivoRejeicao?: string) {
  try {
    if (!id || !["emitida", "em_analise", "negada"].includes(status)) {
      return { success: false as const, error: "Dados inválidos" };
    }
    const updates: Record<string, string | null> = { status };
    if (status === "negada" && motivoRejeicao) {
      updates.motivoRejeicao = motivoRejeicao.trim();
    } else if (status !== "negada") {
      updates.motivoRejeicao = null;
    }
    await db.update(carteiras).set(updates).where(eq(carteiras.id, id));

    audit("admin.status_change", { details: { carteiraId: id, newStatus: status } });

    // Send email notification to card owner
    const carteira = await db.select().from(carteiras).where(eq(carteiras.id, id)).limit(1);
    if (carteira.length > 0 && carteira[0].userId) {
      const user = await db.select().from(usuarios).where(eq(usuarios.id, carteira[0].userId!)).limit(1);
      if (user.length > 0) {
        enviarEmailStatusCarteira(
          user[0].email,
          user[0].nome,
          status,
          id,
          status === "negada" ? motivoRejeicao : undefined,
        ).catch((err) => console.error("[EMAIL] Erro ao notificar status:", err));
      }
    }

    return { success: true as const };
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    return { success: false as const, error: "Erro ao atualizar status" };
  }
}

export async function renovarCarteira(carteiraId: string) {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return { success: false as const, error: "Não autenticado" };
    }

    const result = await db
      .select()
      .from(carteiras)
      .where(eq(carteiras.id, carteiraId))
      .limit(1);

    if (result.length === 0) {
      return { success: false as const, error: "Carteira não encontrada" };
    }

    const carteiraOriginal = result[0];

    if (carteiraOriginal.userId !== usuario.id) {
      return { success: false as const, error: "Sem permissão para renovar esta carteira" };
    }

    // Only allow renewal of issued cards that are expired or expiring within 6 months
    if (carteiraOriginal.status !== "emitida") {
      return { success: false as const, error: "Somente carteiras emitidas podem ser renovadas" };
    }

    const id = generateId();
    const hoje = new Date();
    const dataEmissao = format(hoje, "yyyy-MM-dd");
    const dataValidade = format(addYears(hoje, 5), "yyyy-MM-dd");

    await db.insert(carteiras).values({
      id,
      userId: usuario.id,
      nomeAcompanhante: carteiraOriginal.nomeAcompanhante,
      nomeCompleto: carteiraOriginal.nomeCompleto,
      cpf: carteiraOriginal.cpf,
      dataNascimento: carteiraOriginal.dataNascimento,
      fotoUrl: carteiraOriginal.fotoUrl,
      cpfDocUrl: carteiraOriginal.cpfDocUrl,
      rgDocUrl: carteiraOriginal.rgDocUrl,
      laudoUrl: carteiraOriginal.laudoUrl,
      cid: carteiraOriginal.cid,
      crmMedico: carteiraOriginal.crmMedico,
      rua: carteiraOriginal.rua,
      numero: carteiraOriginal.numero,
      complemento: carteiraOriginal.complemento,
      bairro: carteiraOriginal.bairro,
      cep: carteiraOriginal.cep,
      cidade: carteiraOriginal.cidade,
      estado: carteiraOriginal.estado,
      comprovanteUrl: carteiraOriginal.comprovanteUrl,
      telefone: carteiraOriginal.telefone,
      nomeMae: carteiraOriginal.nomeMae,
      localNascimento: carteiraOriginal.localNascimento,
      tipoSanguineo: carteiraOriginal.tipoSanguineo,
      status: "em_analise",
      dataEmissao,
      dataValidade,
    });

    audit("carteira.renew", {
      userId: usuario.id,
      details: { originalId: carteiraId, newId: id },
    });

    return { success: true as const, id };
  } catch (err) {
    console.error("Erro ao renovar carteira:", err);
    return { success: false as const, error: "Erro interno ao renovar carteira." };
  }
}

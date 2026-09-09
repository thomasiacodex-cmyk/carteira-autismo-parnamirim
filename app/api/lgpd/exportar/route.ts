import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { usuarios, carteiras } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = await db
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email,
      cpf: usuarios.cpf,
      emailVerificado: usuarios.emailVerificado,
      createdAt: usuarios.createdAt,
      updatedAt: usuarios.updatedAt,
    })
    .from(usuarios)
    .where(eq(usuarios.id, session.userId))
    .limit(1);

  if (user.length === 0) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const userCarteiras = await db
    .select({
      id: carteiras.id,
      nomeCompleto: carteiras.nomeCompleto,
      cpf: carteiras.cpf,
      dataNascimento: carteiras.dataNascimento,
      cid: carteiras.cid,
      crmMedico: carteiras.crmMedico,
      rua: carteiras.rua,
      numero: carteiras.numero,
      complemento: carteiras.complemento,
      bairro: carteiras.bairro,
      cep: carteiras.cep,
      cidade: carteiras.cidade,
      estado: carteiras.estado,
      telefone: carteiras.telefone,
      nomeMae: carteiras.nomeMae,
      localNascimento: carteiras.localNascimento,
      tipoSanguineo: carteiras.tipoSanguineo,
      nomeAcompanhante: carteiras.nomeAcompanhante,
      status: carteiras.status,
      dataEmissao: carteiras.dataEmissao,
      dataValidade: carteiras.dataValidade,
      createdAt: carteiras.createdAt,
    })
    .from(carteiras)
    .where(eq(carteiras.userId, session.userId));

  audit("user.data_export", { userId: session.userId });

  const exportData = {
    _info: "Exportação de dados pessoais conforme LGPD - Lei Geral de Proteção de Dados",
    _exportedAt: new Date().toISOString(),
    usuario: user[0],
    carteiras: userCarteiras,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="meus-dados-ciptea-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}

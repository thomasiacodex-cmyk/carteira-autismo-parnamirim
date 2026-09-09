import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carteiras } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function maskCpf(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return `***.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-**`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await db
    .select()
    .from(carteiras)
    .where(eq(carteiras.id, id))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json(
      { error: "Carteira não encontrada" },
      { status: 404 },
    );
  }

  const carteira = result[0];

  return NextResponse.json({
    id: carteira.id,
    nomeCompleto: carteira.nomeCompleto,
    cpf: maskCpf(carteira.cpf),
    status: carteira.status,
    dataEmissao: carteira.dataEmissao,
    dataValidade: carteira.dataValidade,
    fotoUrl: carteira.fotoUrl || null,
    verificado: true,
  });
}

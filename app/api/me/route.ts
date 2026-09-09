import { getUsuarioLogado } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: "Muitas requisições" }, { status: 429 });
  }

  const user = await getUsuarioLogado();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      emailVerificado: user.emailVerificado,
    },
  });
}

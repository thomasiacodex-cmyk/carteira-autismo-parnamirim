import { NextResponse } from "next/server";
import { verificarEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?erro=token-invalido", request.url));
  }

  const result = await verificarEmail(token);

  if (result.success) {
    return NextResponse.redirect(
      new URL("/login?emailVerificado=true", request.url),
    );
  }

  return NextResponse.redirect(
    new URL(`/login?erro=${encodeURIComponent(result.error)}`, request.url),
  );
}

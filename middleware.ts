import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { SignJWT } from "jose";

// Login automático em desenvolvimento (DEV_AUTO_LOGIN=1 no .env). NUNCA usar em produção.
async function devAutoLoginToken(): Promise<string | null> {
  if (process.env.DEV_AUTO_LOGIN !== "1" || process.env.NODE_ENV === "production") return null;
  const userId = process.env.DEV_AUTO_LOGIN_USER_ID;
  const secret = process.env.SESSION_SECRET;
  if (!userId || !secret) return null;
  return new SignJWT({ userId, isAdmin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));
}

const protectedRoutes = ["/solicitar", "/minha-conta", "/perfil"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  if (!token) {
    const devToken = await devAutoLoginToken();
    if (devToken) {
      const response = NextResponse.redirect(request.url);
      response.cookies.set("session", devToken, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
      return response;
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify JWT token is valid
    const session = await verifySessionToken(token);
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid session cookie
      response.cookies.delete("session");
      return response;
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/solicitar/:path*", "/minha-conta/:path*", "/perfil/:path*", "/api/:path*"],
};

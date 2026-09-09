import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET deve ser definida no .env com pelo menos 32 caracteres",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string, isAdmin = false) {
  const token = await new SignJWT({ userId, isAdmin })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  const isHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith("https");
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<{ userId: string; isAdmin?: boolean } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.userId || typeof payload.userId !== "string") return null;
    return { userId: payload.userId, isAdmin: payload.isAdmin === true };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Verify a session token string (for middleware use where cookies() isn't available)
 */
export async function verifySessionToken(
  token: string,
): Promise<{ userId: string; isAdmin?: boolean } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.userId || typeof payload.userId !== "string") return null;
    return { userId: payload.userId, isAdmin: payload.isAdmin === true };
  } catch {
    return null;
  }
}

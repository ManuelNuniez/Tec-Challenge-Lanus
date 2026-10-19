import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session";

const DAY_IN_SECONDS = 24 * 60 * 60;
// "Recordarme" keeps the session for 30 days. Without it the cookie dies with
// the browser, and the token still expires in 12 hours in case the browser
// restores its session cookies on reopen.
const REMEMBER_DURATION = 30 * DAY_IN_SECONDS;
const BROWSER_SESSION_DURATION = DAY_IN_SECONDS / 2;

type SessionPayload = {
  userId: string;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

async function encrypt(payload: SessionPayload, durationInSeconds: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${durationInSeconds}s`)
    .sign(getSecretKey());
}

// Returns null for a missing, tampered or expired token.
export async function decrypt(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, remember: boolean) {
  const duration = remember ? REMEMBER_DURATION : BROWSER_SESSION_DURATION;
  const token = await encrypt({ userId }, duration);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Plain http on localhost, so tools like Insomnia also get the cookie.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Without maxAge the browser drops the cookie when it closes.
    maxAge: remember ? REMEMBER_DURATION : undefined,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

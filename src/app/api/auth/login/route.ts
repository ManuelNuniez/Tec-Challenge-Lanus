import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getFieldErrors, loginSchema } from "@/lib/login-schema";
import type { LoginErrorCode } from "@/lib/login-schema";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

// Compared against when the email does not exist, so a wrong email takes as
// long as a wrong password and the response time does not reveal which one failed.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

function errorResponse(code: LoginErrorCode, status: number, extra = {}) {
  return NextResponse.json({ code, ...extra }, { status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("INVALID_INPUT", 400, {
      fieldErrors: getFieldErrors(parsed.error),
    });
  }

  const { email, password, remember } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches = await bcrypt.compare(
      password,
      user?.passwordHash ?? DUMMY_HASH,
    );
    if (!user || !passwordMatches) {
      return errorResponse("INVALID_CREDENTIALS", 401);
    }

    await createSession(user.id, remember);
    return NextResponse.json({ user: { name: user.name } });
  } catch (error) {
    console.error("Login failed", error);
    return errorResponse("SERVER_ERROR", 500);
  }
}

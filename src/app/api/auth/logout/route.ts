import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  await deleteSession();
  return new Response(null, { status: 204 });
}

// Used by getCurrentUser when the cookie is valid but its user no longer
// exists (e.g. after re-seeding). A page cannot clear cookies while rendering,
// so it redirects here; otherwise the proxy would bounce between / and /login.
export async function GET(request: Request) {
  await deleteSession();
  return NextResponse.redirect(new URL("/login", request.url));
}

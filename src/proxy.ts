import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/session";

const PUBLIC_ROUTES = ["/login"];

// Optimistic check: only looks at the cookie to redirect early. The real check
// (that the user still exists) happens in getCurrentUser.
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const session = await getSession();

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  return NextResponse.next();
}

// API routes check the session themselves and answer with a status code
// instead of a redirect; static files need no session.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|ico)$).*)"],
};

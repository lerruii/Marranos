import { NextRequest, NextResponse } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = await isValidSessionToken(token);

  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protege todo excepto assets estáticos internos de Next.js.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

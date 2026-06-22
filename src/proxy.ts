import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get("auth_user");
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    authCookie &&
    (pathname === "/owner/login" || pathname === "/owner/signup")
  ) {
    return NextResponse.redirect(new URL("/owner/dashboard", request.url));
  }

  if (!authCookie && pathname.startsWith("/owner/dashboard")) {
    return NextResponse.redirect(new URL("/owner/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
};

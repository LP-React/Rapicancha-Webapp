import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get("auth_user");
  const { pathname } = request.nextUrl;

  // 1. Parsing del usuario (Ajusta esto según cómo guardes tu cookie)
  let user = null;
  if (authCookie) {
    try {
      user = JSON.parse(authCookie.value);
    } catch (e) {
      user = { role: "CUSTOMER" }; // Fallback o manejo de error
    }
  }

  const role = user?.role; // 'OWNER' o 'CUSTOMER'

  // --- REGLAS PARA USUARIOS NO AUTENTICADOS ---
  if (!authCookie) {
    // Si intentan entrar a dashboards sin estar logueados
    if (pathname.startsWith("/owner/dashboard")) {
      return NextResponse.redirect(new URL("/owner/login", request.url));
    }
    return NextResponse.next();
  }

  // --- REGLAS PARA USUARIOS AUTENTICADOS ---

  // Si ya está logueado y va a login/signup, redirigir a su dashboard correspondiente
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/owner/login" ||
    pathname === "/owner/signup"
  ) {
    return NextResponse.redirect(
      new URL(role === "OWNER" ? "/owner/dashboard" : "/", request.url),
    );
  }

  // Protección de rutas: Evitar que un CUSTOMER entre a /owner/dashboard
  if (pathname.startsWith("/owner/") && role !== "OWNER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Excluir rutas de assets, api, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

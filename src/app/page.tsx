import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rapicancha — Reserva tu cancha al instante",
  description:
    "Rapicancha es la plataforma más rápida para reservar canchas deportivas. Ingresa, elige tu horario y juega.",
};

/**
 * Landing page (/).
 *
 * Async Server Component — lee la cookie auth_user en el servidor para
 * evitar el loop de redirección del proxy.
 *
 * Flujo de redirección:
 *   OWNER autenticado       → /owner/dashboard  (redirect en el servidor)
 *   CUSTOMER autenticado    → muestra CTA de explorar (no expone /login)
 *   Sin sesión              → muestra botones Login / Crear cuenta
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_user");

  // Parseo defensivo — cookie malformada se trata como sin sesión
  let user: { role?: string } | null = null;
  if (authCookie?.value) {
    try {
      user = JSON.parse(authCookie.value);
    } catch {
      user = null;
    }
  }

  // OWNER → redirigir al dashboard en el servidor (sin parpadeo)
  if (user?.role === "OWNER") {
    redirect("/owner/dashboard");
  }

  const isAuthenticated = user !== null;
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#111508] text-[#e2e4cf] font-sans antialiased">
      {/* ── Ambient glows ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/* primary lime glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c3f400] opacity-[0.07] blur-[120px]" />
        {/* accent teal glow (top-right) */}
        <div className="absolute -top-20 right-0 w-[300px] h-[300px] rounded-full bg-[#00e5ff] opacity-[0.04] blur-[100px]" />
        {/* warm glow (bottom-left) */}
        <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full bg-[#ffea00] opacity-[0.04] blur-[100px]" />
      </div>

      {/* ── Subtle grid overlay ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(195,244,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(195,244,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main content ──────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-[#c3f400]/20 bg-[#c3f400]/10 px-4 py-1.5 text-xs font-semibold text-[#c3f400] uppercase tracking-widest mb-8 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse" />
          Plataforma deportiva
        </span>

        {/* Logotype */}
        <h1 className="text-[clamp(3rem,14vw,6rem)] font-black italic uppercase leading-none tracking-tighter text-[#c3f400] drop-shadow-[0_0_40px_rgba(195,244,0,0.35)] mb-4">
          Rapi<wbr />cancha
        </h1>

        {/* Tagline */}
        <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#c4c9ac] leading-relaxed mb-10 max-w-sm">
          Reserva tu cancha favorita en segundos.{" "}
          <span className="text-[#e2e4cf] font-medium">Sin llamadas. Sin filas.</span>
        </p>

        {/* CTA buttons — se adaptan al estado de autenticación */}
        {isAuthenticated ? (
          /* CUSTOMER con sesión activa: no mostramos links de auth
             para evitar el loop del proxy (/login → / → /login …) */
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-sm text-[#c4c9ac]/80">
              ✅ Sesión activa. Explora y reserva tu cancha.
            </p>
            <Link
              id="cta-browse"
              href="/local/1"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c3f400] px-8 py-4 text-[#161e00] text-lg font-bold shadow-[0_0_24px_rgba(195,244,0,0.3)] hover:shadow-[0_0_36px_rgba(195,244,0,0.5)] hover:bg-[#d4ff00] active:scale-95 transition-all duration-200"
            >
              Explorar canchas
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          /* Sin sesión: botones de auth normales */
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              id="cta-login"
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#c3f400] px-8 py-4 text-[#161e00] text-lg font-bold shadow-[0_0_24px_rgba(195,244,0,0.3)] hover:shadow-[0_0_36px_rgba(195,244,0,0.5)] hover:bg-[#d4ff00] active:scale-95 transition-all duration-200"
            >
              Iniciar sesión
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              id="cta-signup"
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#c3f400]/30 bg-[#1e2113]/60 backdrop-blur-sm px-8 py-4 text-[#c3f400] text-lg font-semibold hover:bg-[#c3f400]/10 hover:border-[#c3f400]/60 active:scale-95 transition-all duration-200"
            >
              Crear cuenta
            </Link>
          </div>
        )}

        {/* Feature pills */}
        <ul
          aria-label="Características principales"
          className="mt-14 flex flex-wrap justify-center gap-3"
        >
          {[
            { emoji: "⚡", label: "Reserva en segundos" },
            { emoji: "🗺️", label: "Localiza canchas" },
            { emoji: "📅", label: "Gestiona tus turnos" },
          ].map(({ emoji, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-full bg-[#1e2113]/70 border border-white/5 px-4 py-2 text-sm text-[#c4c9ac]"
            >
              <span aria-hidden="true">{emoji}</span>
              {label}
            </li>
          ))}
        </ul>
      </main>

      {/* ── Footer note ───────────────────────────────────────────── */}
      <footer className="relative z-10 mt-16 pb-8 text-center">
        <p className="text-xs text-[#c4c9ac]/50">
          © {new Date().getFullYear()} Rapicancha. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

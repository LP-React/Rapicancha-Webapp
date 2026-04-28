"use client";
import { LogIn } from "lucide-react";
import Link from "next/link";

export function AuthRequiredView({ qrCode }: { qrCode: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdf7] p-6">
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-xl border border-white text-center max-w-sm w-full font-sans">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#191c1a] mb-3">
          Sesión requerida
        </h2>
        <p className="text-[#414942] text-sm mb-8">
          No se encontró ninguna cuenta iniciada. Inicia sesión primero para
          hacer check-in.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href={`/login?callback=/check-in/${qrCode}`}
            className="w-full py-4 bg-[#2d4a41] text-white font-bold rounded-xl text-xs uppercase tracking-widest"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { LoginUserForm } from "@/components/auth/LoginUserForm";

export default function LoginView() {
  return (
    <div className="bg-[#111508] text-[#e2e4cf] min-h-screen flex flex-col items-center justify-center font-sans antialiased overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
        <div className="w-96 h-96 bg-[#c3f400] rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-md px-[20px] z-10 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-[24px]">
          <h1 className="text-[34px] leading-[41px] font-bold text-[#c3f400] italic uppercase tracking-tighter mb-[8px]">
            Rapicancha
          </h1>
          <p className="text-[17px] text-[#c4c9ac]">
            Ingresa para asegurar tu cancha.
          </p>
        </div>

        {/* Login Form Component */}
        <LoginUserForm />

        {/* Footer Link */}
        <div className="text-center mt-[24px]">
          <p className="text-[17px] text-[#c4c9ac]">
            ¿No tienes cuenta?{" "}
            <Link
              href="/signup"
              className="text-[#c3f400] font-bold hover:underline underline-offset-4"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

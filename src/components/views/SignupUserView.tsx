import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignupUserForm } from "@/components/auth/SignupUserForm";

export default function SignupView() {
  return (
    <div className="bg-[#111508] text-[#e2e4cf] min-h-screen flex flex-col font-sans antialiased overflow-y-auto relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
        <div className="w-96 h-96 bg-[#c3f400] rounded-full blur-[120px]"></div>
      </div>

      {/* Header (Back Button) */}
      <div className="w-full max-w-md mx-auto px-[20px] z-10 pt-[24px] pb-[8px] flex items-center shrink-0">
        <Link
          href="/login"
          className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors mr-auto"
        >
          <ArrowLeft size={24} />
        </Link>
      </div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-md mx-auto px-[20px] z-10 flex flex-col flex-1 justify-center">
        {/* Header Titles */}
        <div className="text-center mb-[16px]">
          <h1 className="text-[28px] leading-tight font-bold text-[#c3f400] italic uppercase tracking-tighter mb-[4px]">
            Rapicancha
          </h1>
          <p className="text-sm text-[#c4c9ac]">
            Únete para reservar canchas rápidamente.
          </p>
        </div>

        {/* Registration Form Component */}
        <SignupUserForm />
      </main>
    </div>
  );
}

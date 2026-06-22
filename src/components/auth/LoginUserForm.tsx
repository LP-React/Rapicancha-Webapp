// components/auth/LoginUserForm.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthService } from "@/services/auth-service";
import { loginSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import { getCookie, setCookie } from "cookies-next";

export function LoginUserForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userSession = getCookie("auth_user");
    if (userSession) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as any;

    startTransition(async () => {
      try {
        const validatedData = loginSchema.parse(payload);
        const response = await AuthService.login(validatedData);

        setCookie("auth_user", JSON.stringify(response), {
          maxAge: 60 * 60 * 24, // 1 día
          path: "/",
        });

        toast.success("¡Bienvenido a Rapicancha!");
        router.refresh();
        router.replace("/");
      } catch (error: any) {
        if (error.name === "ZodError") {
          toast.error(error.issues?.[0]?.message || "Error de validación");
          return;
        }
        toast.error(error.message || "Error al iniciar sesión");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-[16px] w-full bg-[#1e2113]/50 backdrop-blur-xl p-[24px] rounded-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Email Input */}
      <div className="flex flex-col">
        <label
          htmlFor="email"
          className="font-medium text-[13px] text-[#c4c9ac] mb-[4px]"
        >
          Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
            size={20}
          />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            disabled={isPending}
            className="w-full bg-[#282b1d] border-none rounded-lg py-3 pl-10 pr-4 text-[#e2e4cf] text-[17px] placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="flex flex-col">
        <label
          htmlFor="password"
          className="font-medium text-[13px] text-[#c4c9ac] mb-[4px]"
        >
          Contraseña
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
            size={20}
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            disabled={isPending}
            className="w-full bg-[#282b1d] border-none rounded-lg py-3 pl-10 pr-12 text-[#e2e4cf] text-[17px] placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c9ac] hover:text-[#e2e4cf] transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="flex justify-end mt-[4px]">
          <a
            href="/forgot-password"
            className="font-medium text-[13px] text-[#c3f400] hover:opacity-80 transition-opacity"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-[8px] w-full flex justify-center items-center gap-2 bg-[#c3f400] text-[#161e00] font-semibold text-[22px] py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(204,255,0,0.2)] disabled:opacity-70 disabled:active:scale-100"
      >
        {isPending ? <Loader2 className="animate-spin" size={24} /> : "Login"}
      </button>
    </form>
  );
}

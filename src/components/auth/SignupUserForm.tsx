// components/auth/SignupUserForm.tsx
"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Badge, Phone, Mail, Lock, Loader2 } from "lucide-react";
import { AuthService } from "@/services/auth-service";
import { signupSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

export function SignupUserForm() {
  const [isPending, startTransition] = useTransition();
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
    const rawData = Object.fromEntries(formData.entries());

    const payload = {
      email: rawData.email as string,
      password: rawData.password as string,
      role: "CUSTOMER",
      firstName: rawData.firstName as string,
      lastName: rawData.lastName as string,
      phone: rawData.phone as string,
      nationalId: rawData.nationalId as string,
      terms: rawData.terms === "on",
    };

    startTransition(async () => {
      try {
        const validatedData = signupSchema.parse(payload);
        const { terms, ...apiPayload } = validatedData;

        await AuthService.register(apiPayload);
        toast.success("¡Cuenta creada exitosamente!");

        setTimeout(() => {
          router.push("/login");
        }, 500);
      } catch (error: any) {
        if (error.name === "ZodError") {
          const firstMessage =
            error.issues?.[0]?.message || error.errors?.[0]?.message;
          toast.error(firstMessage || "Error de validación");
          return;
        }
        toast.error(error.message || "Error inesperado al registrarse");
      }
    });
  };

  return (
    <>
      <form
        id="signup-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-[8px] w-full bg-[#1e2113]/50 backdrop-blur-xl p-[16px] rounded-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <div className="flex gap-[8px]">
          {/* First Name */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="firstName"
              className="font-medium text-[11px] text-[#c4c9ac] mb-[4px]"
            >
              Nombre
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
                size={18}
              />
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Fernando"
                required
                minLength={2}
                maxLength={20}
                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                disabled={isPending}
                className="w-full bg-[#282b1d] border-none rounded-lg py-2.5 pl-9 pr-3 text-[#e2e4cf] text-sm placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="lastName"
              className="font-medium text-[11px] text-[#c4c9ac] mb-[4px]"
            >
              Apellido
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
                size={18}
              />
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Sterling"
                required
                minLength={2}
                maxLength={20}
                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                disabled={isPending}
                className="w-full bg-[#282b1d] border-none rounded-lg py-2.5 pl-9 pr-3 text-[#e2e4cf] text-sm placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
              />
            </div>
          </div>
        </div>

        {/* National ID */}
        <div className="flex flex-col">
          <label
            htmlFor="nationalId"
            className="font-medium text-[11px] text-[#c4c9ac] mb-[4px]"
          >
            Cédula / DNI
          </label>
          <div className="relative">
            <Badge
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
              size={18}
            />
            <input
              id="nationalId"
              name="nationalId"
              type="text"
              placeholder="12345678"
              required
              minLength={8}
              maxLength={8}
              inputMode="numeric"
              pattern="[0-9]{8}"
              disabled={isPending}
              className="w-full bg-[#282b1d] border-none rounded-lg py-2.5 pl-9 pr-3 text-[#e2e4cf] text-sm placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label
            htmlFor="phone"
            className="font-medium text-[11px] text-[#c4c9ac] mb-[4px]"
          >
            Teléfono
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
              size={18}
            />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="987654321"
              required
              minLength={9}
              maxLength={9}
              inputMode="numeric"
              pattern="[0-9]{9}"
              disabled={isPending}
              className="w-full bg-[#282b1d] border-none rounded-lg py-2.5 pl-9 pr-3 text-[#e2e4cf] text-sm placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="font-medium text-[11px] text-[#c4c9ac] mb-[4px]"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
              size={18}
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              disabled={isPending}
              className="w-full bg-[#282b1d] border-none rounded-lg py-2.5 pl-9 pr-3 text-[#e2e4cf] text-sm placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="font-medium text-[11px] text-[#c4c9ac] mb-[4px]"
          >
            Contraseña
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac]"
              size={18}
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              disabled={isPending}
              className="w-full bg-[#282b1d] border-none rounded-lg py-2.5 pl-9 pr-3 text-[#e2e4cf] text-sm placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-0 focus:border-l-2 focus:border-[#c3f400] transition-all"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="accent-[#c3f400] w-4 h-4 rounded border-[#c4c9ac] bg-[#282b1d]"
          />
          <label htmlFor="terms" className="text-[12px] text-[#c4c9ac]">
            Acepto los{" "}
            <span className="text-[#c3f400] font-semibold">
              términos y condiciones.
            </span>
          </label>
        </div>
      </form>

      <div className="text-center mt-[16px] pb-[100px]">
        <p className="text-sm text-[#c4c9ac]">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-[#c3f400] font-bold hover:underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-[20px] bg-[#111508]/90 backdrop-blur-md border-t border-white/5 z-20 flex justify-center">
        <div className="w-full max-w-md">
          <button
            form="signup-form"
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center items-center gap-2 bg-[#c3f400] text-[#161e00] font-semibold text-[22px] py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(204,255,0,0.2)] disabled:opacity-70 disabled:active:scale-100"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Registrarse"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation"; // Importa el router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn, Loader2, HelpCircle } from "lucide-react";
import { AuthService } from "@/services/auth-service";
import { loginSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import { setCookie } from "cookies-next";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Inicializa el hook

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as any;

    startTransition(async () => {
      try {
        const validatedData = loginSchema.parse(payload);
        const response = await AuthService.login(validatedData);

        setCookie("auth_user", response, {
          maxAge: 60 * 60 * 24, // 1 día
          path: "/",
        });

        toast.success("¡Bienvenido de nuevo!");
        router.push("/dashboard");
      } catch (error: any) {
        if (error.name === "ZodError") {
          toast.error(error.issues?.[0]?.message || "Error de validación");
          return;
        }
        toast.error(error.message);
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* ... (resto del JSX igual que antes) */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">
          Bienvenido de nuevo
        </h2>
        <p className="text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@pavilion.com"
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <a
                href="#"
                className="text-xs font-semibold text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </span>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12"
              />
            </div>
          </div>
        </div>

        <Button
          disabled={isPending}
          type="submit"
          className="w-full h-12 custom-gradient font-bold editorial-shadow"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Iniciar Sesión <LogIn className="ml-2" size={18} />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <a
            href="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Regístrate
          </a>
        </p>
      </form>

      <div className="text-center pt-2">
        <button className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors">
          <HelpCircle size={16} /> ¿Necesitas ayuda con tu acceso?
        </button>
      </div>
    </div>
  );
}

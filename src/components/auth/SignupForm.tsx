"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Badge,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { AuthService } from "@/services/auth-service";
import { signupSchema } from "@/lib/validations/auth";
import { toast } from "sonner";

export function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const payload = {
      email: rawData.email as string,
      password: rawData.password as string,
      role: "OWNER",
      firstName: rawData.firstName as string,
      lastName: rawData.lastName as string,
      phone: rawData.phone as string,
      nationalId: rawData.dni as string,
      terms: rawData.terms === "on",
    };

    startTransition(async () => {
      try {
        const validatedData = signupSchema.parse(payload);
        const { terms, ...apiPayload } = validatedData;
        console.log("Datos limpios para la API:", apiPayload);
        await AuthService.register(apiPayload);

        toast.success("¡Cuenta creada exitosamente!");
      } catch (error: any) {
        if (error.name === "ZodError") {
          const firstMessage =
            error.issues?.[0]?.message || error.errors?.[0]?.message;

          toast.error(firstMessage || "Error de validación");
          return;
        }
        toast.error(error.message || "Error inesperado");
      }
    });
  };
  return (
    <div className="w-full max-w-md space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">
          Crea tu cuenta
        </h2>
        <p className="text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </header>

      {/* Usamos el action nativo de React 19 */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Nombres"
            name="firstName"
            icon={<User size={18} />}
            placeholder="Fernando"
            minLength={2}
            maxLength={20}
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
          />
          <FormInput
            label="Apellidos"
            name="lastName"
            icon={<User size={18} />}
            placeholder="Sterling"
            minLength={2}
            maxLength={20}
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="DNI"
            name="dni"
            icon={<Badge size={18} />}
            placeholder="12345678"
            minLength={8}
            maxLength={8}
            inputMode="numeric"
            pattern="[0-9]{8}"
          />
          <FormInput
            label="Número tel."
            name="phone"
            icon={<Phone size={18} />}
            placeholder="987654321"
            type="tel"
            minLength={9}
            maxLength={9}
            inputMode="numeric"
            pattern="[0-9]{9}"
          />
        </div>

        <FormInput
          label="Correo"
          name="email"
          icon={<Mail size={18} />}
          placeholder="admin@admin.com"
          type="email"
        />
        <FormInput
          label="Password"
          name="password"
          icon={<Lock size={18} />}
          placeholder="••••••••"
          type="password"
          minLength={8}
        />

        <div className="flex items-start gap-3 py-2">
          <Checkbox id="terms" name="terms" required />
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-tight cursor-pointer"
          >
            Acepto los{" "}
            <span className="text-primary font-semibold">
              terminos y condiciones.
            </span>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full custom-gradient editorial-shadow h-12 text-lg font-bold transition-opacity disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Crear cuenta <ArrowRight className="ml-2" size={20} />
            </>
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <button className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors">
          <HelpCircle size={16} /> ¿Necesitas ayuda?
        </button>
      </div>
    </div>
  );
}

function FormInput({ label, icon, name, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="font-semibold">
        {label}
      </Label>
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
          {icon}
        </span>
        <Input
          {...props}
          id={name}
          name={name} // CRÍTICO: El name debe coincidir con la lógica de extracción
          className="pl-10 h-12 bg-background border-outline focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:border-primary transition-all"
        />
      </div>
    </div>
  );
}

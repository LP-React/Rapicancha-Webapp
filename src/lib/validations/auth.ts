import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(20, "El nombre no puede superar los 20 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(20, "El apellido no puede superar los 20 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El apellido solo puede contener letras",
    ),

  email: z
    .string()
    .email("Introduce un correo electrónico válido")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),

  phone: z
    .string()
    .length(9, "El teléfono debe tener exactamente 9 dígitos")
    .regex(/^[0-9]+$/, "Solo se permiten números (sin guiones ni símbolos)"),

  nationalId: z
    .string()
    .length(8, "El DNI debe tener exactamente 8 dígitos")
    .regex(/^[0-9]+$/, "El ID debe contener solo números"),

  role: z.enum(["OWNER", "CUSTOMER"]).default("OWNER"),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Introduce un correo válido")
    .toLowerCase(),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

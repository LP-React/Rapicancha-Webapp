import * as z from "zod";

export const sportCourtSchema = z.object({
  venueId: z.number(),

  name: z
    .string({ message: "El nombre es obligatorio" })
    .min(3, "El nombre requiere al menos 3 caracteres"),

  description: z
    .string({ message: "La descripción es obligatoria" })
    .min(10, "La descripción debe tener al menos 10 caracteres"),

  sportType: z.string().min(1, "Selecciona el tipo de deporte"),

  surfaceType: z.string().min(1, "Selecciona el tipo de superficie"),

  rate: z.coerce.number().min(1, "La tarifa debe ser mayor a 0"),
  capacity: z.coerce.number().int().min(1),
  slotMinutes: z.coerce.number().min(15),
  playMinutes: z.coerce.number().min(15),

  hasRoof: z.boolean().default(false),
  hasLighting: z.boolean().default(false),

  rules: z.string().default(""),

  imageUrls: z
    .array(z.string().url())
    .min(1, "Debes subir al menos una foto de la cancha"),
});

export type SportCourtFormValues = z.infer<typeof sportCourtSchema>;

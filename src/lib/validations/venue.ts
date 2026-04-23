import * as z from "zod";

export const venueSchema = z.object({
  ownerAccountId: z.number().default(1),

  name: z
    .string({
      message: "El nombre es obligatorio",
    })
    .min(3, "El nombre requiere al menos 3 caracteres"),

  address: z
    .string({
      message: "La dirección es obligatoria",
    })
    .min(5, "La dirección debe ser más detallada"),

  description: z
    .string({
      message: "La descripción es obligatoria",
    })
    .min(10, "La descripción debe tener al menos 10 caracteres"),

  latitude: z.number({
    message: "Debes marcar la ubicación en el mapa",
  }),

  longitude: z.number({
    message: "Debes marcar la ubicación en el mapa",
  }),

  openTime: z.string().min(1, "Selecciona una hora de apertura"),

  closeTime: z.string().min(1, "Selecciona una hora de cierre"),

  maxCapacity: z.coerce
    .number({
      message: "La capacidad debe ser un número válido",
    })
    .min(1, "La capacidad mínima es de 1 persona"),

  parkingCapacity: z.coerce
    .number({
      message: "El número de parqueos debe ser un número",
    })
    .min(0, "El parqueo no puede ser negativo")
    .default(0),

  bannerImageUrl: z
    .string({
      message: "La imagen es obligatoria",
    })
    .url("La URL de la imagen no es válida"),

  providesEquipment: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasLockerRoom: z.boolean().default(false),
  hasRestroom: z.boolean().default(false),
  hasStore: z.boolean().default(false),
  hasShower: z.boolean().default(false),
  providesBalls: z.boolean().default(false),
  providesBibs: z.boolean().default(false),
});

export type VenueFormValues = z.infer<typeof venueSchema>;

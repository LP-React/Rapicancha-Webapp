/**
 * Interfaces de Datos
 */
export interface AvailabilityRequest {
  sportCourtId: number;
  weekday: number;
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponse extends AvailabilityRequest {
  idAvailability: number;
}

export interface DayAvailability {
  weekday: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AvailabilityService = {
  getByCourtId: async (courtId: number): Promise<AvailabilityResponse[]> => {
    const res = await fetch(`${API_URL}/api/availability/court/${courtId}`);
    if (!res.ok) throw new Error("Error al obtener disponibilidad");
    return res.json();
  },

  saveBulk: async (
    availabilities: AvailabilityRequest[],
  ): Promise<AvailabilityResponse[]> => {
    const requests = availabilities.map(async (data) => {
      const res = await fetch(`${API_URL}/api/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const daysLabel = [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ];
        throw new Error(
          errorData.message ||
            `Error en el horario del día ${daysLabel[data.weekday]}`,
        );
      }
      return res.json();
    });

    return Promise.all(requests);
  },
};

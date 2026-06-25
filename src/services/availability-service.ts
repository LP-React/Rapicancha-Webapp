import { http } from "@/lib/http";
import {
  AvailabilityRequest,
  AvailabilityResponse,
} from "@/types/api/availability/availability";

export const AvailabilityService = {
  getByCourtId: async (courtId: number): Promise<AvailabilityResponse[]> => {
    return await http<AvailabilityResponse[]>(`/api/availability/court/${courtId}`);
  },

  saveBulk: async (
    availabilities: AvailabilityRequest[],
  ): Promise<AvailabilityResponse[]> => {
    const requests = availabilities.map(async (data) => {
      try {
        return await http<AvailabilityResponse>(`/api/availability`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      } catch (error: any) {
        const daysLabel = [
          "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo",
        ];
        
        throw new Error(
          error.message || `Error en el horario del día ${daysLabel[data.weekday] || data.weekday}`,
        );
      }
    });

    return Promise.all(requests);
  },
};
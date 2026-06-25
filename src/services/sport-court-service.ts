import { http } from "@/lib/http";
import {
  CreateSportCourtRequest,
  SportCourtResponse,
} from "@/types/api/sport-courts/sportCourt";

export const SportCourtService = {
  getByVenue: async (venueId: number): Promise<SportCourtResponse[]> => {
    try {
      return await http<SportCourtResponse[]>(`/api/sport-courts?idVenue=${venueId}`, {
        cache: "no-store",
      });
    } catch (error) {
      console.error("CourtService getByVenue error:", error);
      return [];
    }
  },

  create: async (
    courtData: CreateSportCourtRequest,
  ): Promise<SportCourtResponse> => {
    try {
      return await http<SportCourtResponse>(`/api/sport-courts`, {
        method: "POST",
        body: JSON.stringify(courtData),
      });
    } catch (error: any) {
      const errorMessage = error.message || "Error al crear la cancha";
      throw new Error(errorMessage);
    }
  },
};
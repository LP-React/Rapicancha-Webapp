import {
  CreateSportCourtRequest,
  SportCourtResponse,
} from "@/types/api/sport-courts/sportCourt";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SportCourtService = {
  getByVenue: async (venueId: number): Promise<SportCourtResponse[]> => {
    try {
      const response = await fetch(
        `${API_URL}/api/sport-courts?idVenue=${venueId}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Error al obtener canchas del local ${venueId}`);
      }

      return await response.json();
    } catch (error) {
      console.error("CourtService getByVenue error:", error);
      return [];
    }
  },

  create: async (
    courtData: CreateSportCourtRequest,
  ): Promise<SportCourtResponse> => {
    const response = await fetch(`${API_URL}/api/sport-courts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courtData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al crear la cancha");
    }

    return await response.json();
  },
};

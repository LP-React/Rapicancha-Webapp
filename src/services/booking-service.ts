import { BookingResponse } from "@/types/api/bookings/booking";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const BookingService = {
  getBySportCourt: async (sportCourtId: number): Promise<BookingResponse[]> => {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings?sportCourtId=${sportCourtId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener las reservas");
      }

      return await response.json();
    } catch (error: any) {
      console.error("BookingService Error:", error.message);
      throw error;
    }
  },
  getAll: async (params: {
    sportCourtId?: number;
    ownerId?: number;
  }): Promise<BookingResponse[]> => {
    const query = new URLSearchParams();
    if (params.sportCourtId)
      query.append("sportCourtId", params.sportCourtId.toString());
    if (params.ownerId) query.append("ownerId", params.ownerId.toString());

    const response = await fetch(
      `${API_URL}/api/bookings?${query.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("Error en la petición");
    return response.json();
  },
};

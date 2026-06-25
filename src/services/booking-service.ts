import { BookingResponse, CheckInResponse } from "@/types/api/bookings/booking";
import { http } from "@/lib/http";


export const BookingService = {
  getBySportCourt: async (sportCourtId: number): Promise<BookingResponse[]> => {
    try {
      return await http<BookingResponse[]>(`/api/bookings?sportCourtId=${sportCourtId}`, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error: any) {
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        throw new Error("El servicio de reservas se encuentra fuera de línea.");
      }
      if (error.status >= 500) {
        throw new Error("El servicio de reservas no está disponible en este momento.");
      }
      console.error("BookingService Error:", error.message);
      throw error;
    }
  },

  getByCustomer: async (customerId: number): Promise<BookingResponse[]> => {
    try {
      return await http<BookingResponse[]>(`/api/bookings?customerId=${customerId}`, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error: any) {
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        throw new Error("El servicio de reservas se encuentra fuera de línea.");
      }
      if (error.status >= 500) {
        throw new Error("El servicio de reservas no está disponible en este momento.");
      }
      console.error("BookingService Error:", error.message);
      throw error;
    }
  },

create: async (payload: {
    sportCourtId: number;
    customerAccountId: number;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
  }): Promise<BookingResponse> => {
    try {
      return await http<BookingResponse>(`/api/bookings`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error: any) {
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        throw new Error("El servicio de reservas se encuentra fuera de línea.");
      }
      if (error.status >= 500) {
        throw new Error("El servicio de reservas no está disponible en este momento.");
      }
      console.error("BookingService Error:", error.message);
      throw error;
    }
  },
getAll: async (params: {
    sportCourtId?: number;
    ownerId?: number;
  }): Promise<BookingResponse[]> => {
    try {
      const query = new URLSearchParams();
      if (params.sportCourtId) query.append("sportCourtId", params.sportCourtId.toString());
      if (params.ownerId) query.append("ownerId", params.ownerId.toString());

      return await http<BookingResponse[]>(`/api/bookings?${query.toString()}`);
    } catch (error: any) {
      console.error("BookingService Error:", error.message);
      throw new Error("Error en la petición");
    }
  },

checkIn: async (qrCode: string, ownerId: number): Promise<CheckInResponse> => {
    try {
      return await http<CheckInResponse>(`/api/bookings/checkin`, {
        method: "POST",
        body: JSON.stringify({ qrCode, ownerId }),
      });
    } catch (error: any) {
      console.error("BookingService Error:", error.message);
      throw error;
    }
  },
};

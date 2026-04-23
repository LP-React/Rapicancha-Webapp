import { VenueResponse } from "@/types/api/venues/venue";

export const VenueService = {
  async getAll(): Promise<VenueResponse[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/venues`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("Error al obtener los locales");
    return response.json();
  },
};

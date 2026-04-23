import { CreateVenueRequest, VenueResponse } from "@/types/api/venues/venue";

export interface VenueFilters {
  ownerId?: number;
  name?: string;
  address?: string;
}

export const VenueService = {
  async getAll(filters: VenueFilters = {}): Promise<VenueResponse[]> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/venues${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Error al obtener los locales");
    return response.json();
  },

  async create(venue: CreateVenueRequest): Promise<VenueResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/venues`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venue),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el local");
    }
    return response.json();
  },
};

import {
  CreateVenueRequest,
  VenueResponse,
  VenueWithCourtsResponse,
} from "@/types/api/venues/venue";
import { http } from "@/lib/http";

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
    const endpoint = `/api/venues${queryString ? `?${queryString}` : ""}`;

    return http<VenueResponse[]>(endpoint, { cache: "no-store" });
  },

  async create(venue: CreateVenueRequest): Promise<VenueResponse> {
    return http<VenueResponse>("/api/venues", {
      method: "POST",
      body: JSON.stringify(venue),
    });
  },

  async getVenuesAndCourts(
    ownerId: number,
  ): Promise<VenueWithCourtsResponse[]> {
    const params = new URLSearchParams({ idOwner: ownerId.toString() });
    const endpoint = `/api/venues-and-sport-court?${params.toString()}`;

    return http<VenueWithCourtsResponse[]>(endpoint, { cache: "no-store" });
  },
};
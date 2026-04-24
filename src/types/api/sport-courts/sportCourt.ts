export interface SportCourtImage {
  idImage: number;
  imageUrl: string;
}

export interface SportCourtResponse {
  idSportCourt: number;
  name: string;
  description: string;
  sportType: string;
  surfaceType: string;
  capacity: number;
  rate: number;
  playMinutes: number;
  slotMinutes: number;
  hasLighting: boolean;
  hasRoof: boolean;
  isActive: boolean;
  rules: string;
  venueId: number;
  venueName: string;
  images: SportCourtImage[];
}

export interface CreateSportCourtRequest {
  venueId: number;
  name: string;
  description: string;
  sportType: string;
  surfaceType: string;
  capacity: number;
  hasRoof: boolean;
  hasLighting: boolean;
  rules: string;
  rate: number;
  slotMinutes: number;
  playMinutes: number;
  imageUrls: string[];
}

export interface VenueResponse {
  idVenue: number;
  name: string;
  address: string;
  description: string;
  bannerImageUrl: string | null;
  openTime: string;
  closeTime: string;
  is_active: boolean;
  maxCapacity: number;
  hasParking: boolean;
  hasRestroom: boolean;
  hasShower: boolean;
  hasLockerRoom: boolean;
  hasStore: boolean;
  providesBalls: boolean;
  providesBibs: boolean;
  ownerId: number;
  ownerName: string;
  latitude: number;
  longitude: number;
}

export interface CreateVenueRequest {
  ownerAccountId: number;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  maxCapacity: number;
  parkingCapacity: number;
  bannerImageUrl: string;
  providesEquipment: boolean;
  hasParking: boolean;
  hasLockerRoom: boolean;
  hasRestroom: boolean;
  hasStore: boolean;
  hasShower: boolean;
  providesBalls: boolean;
  providesBibs: boolean;
}

export interface SportCourt {
  idSportCourt: number;
  name: string;
}

export interface VenueWithCourtsResponse {
  idVenue: number;
  name: string;
  sport_courts: SportCourt[];
}

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

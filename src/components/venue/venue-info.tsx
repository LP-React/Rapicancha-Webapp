import { MapPin, Clock, Car, Droplet, Circle, Shirt } from "lucide-react";
import { VenueResponse } from "@/types/api/venues/venue";

interface VenueInfoProps {
  venue: VenueResponse;
}

export function VenueInfo({ venue }: VenueInfoProps) {
  const formatTime = (time: string) => time.slice(0, 5);

  return (
    <section className="px-4 mt-4 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{venue.name}</h2>
        <div className="flex items-center gap-1.5 text-[#a1a68d]">
          <MapPin className="w-4 h-4" />
          <p className="text-sm">{venue.address}</p>
        </div>
      </div>

      <div className="bg-[#181c0c] border border-[#333627] p-4 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-[#abd600] w-5 h-5" />
            <div>
              <p className="text-xs text-[#a1a68d] uppercase font-bold tracking-wider">
                Hours
              </p>
              <p className="text-sm font-medium text-[#e2e4cf]">
                Open: {formatTime(venue.openTime)} -{" "}
                {formatTime(venue.closeTime)}
              </p>
            </div>
          </div>
          {venue.is_active && (
            <span className="bg-[#abd600]/20 text-[#abd600] px-2 py-0.5 rounded text-[11px] font-bold">
              OPEN NOW
            </span>
          )}
        </div>

        <div className="h-px bg-[#333627]"></div>

        <div>
          <p className="text-xs text-[#a1a68d] uppercase font-bold tracking-wider mb-2">
            Amenities
          </p>
          <div className="flex flex-wrap gap-2 text-[#e2e4cf]">
            {venue.hasParking && (
              <div className="flex items-center gap-1.5 bg-[#2a2e1c] px-2.5 py-1 rounded text-xs font-medium">
                <Car className="w-4 h-4" /> Parking{" "}
                {venue.parkingCapacity ? `(${venue.parkingCapacity})` : ""}
              </div>
            )}
            {venue.hasShower && (
              <div className="flex items-center gap-1.5 bg-[#2a2e1c] px-2.5 py-1 rounded text-xs font-medium">
                <Droplet className="w-4 h-4" /> Showers
              </div>
            )}
            {venue.providesBalls && (
              <div className="flex items-center gap-1.5 bg-[#2a2e1c] px-2.5 py-1 rounded text-xs font-medium">
                <Circle className="w-4 h-4" /> Balls Provided
              </div>
            )}
            {venue.providesEquipment && (
              <div className="flex items-center gap-1.5 bg-[#2a2e1c] px-2.5 py-1 rounded text-xs font-medium">
                <Shirt className="w-4 h-4" /> Equipment
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">About</h3>
        <p className="text-[#a1a68d] text-sm leading-relaxed">
          {venue.description}
        </p>
      </div>
    </section>
  );
}

import Image from "next/image";
import { VenueResponse } from "@/types/api/venues/venue";
import { SportCourtResponse } from "@/types/api/sport-courts/sportCourt";
import { VenueInfo } from "@/components/venue/venue-info";
import { MapPin } from "lucide-react";
import { VenueHeader } from "../venue/VenueHeader";
import { VenueCourts } from "../venue/VenueCourts";
import { BottomNav } from "../ui/botton-nav";
import { VenueMap } from "../venue/VenueMap";

interface VenueDetailsViewProps {
  venue: VenueResponse;
  courts: SportCourtResponse[];
}

export function VenueDetailsView({ venue, courts }: VenueDetailsViewProps) {
  const bannerImage =
    venue.bannerImageUrl ||
    "https://placehold.co/600x400/181c0c/333627?text=No+Image";

  return (
    <div className="bg-[#111508] min-h-screen font-sans pb-24">
      <VenueHeader />

      <main>
        <section className="px-4 mt-4">
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#181c0c] relative">
            <Image
              src={bannerImage}
              alt={venue.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        <VenueInfo venue={venue} />

        <VenueCourts courts={courts} />

        <section className="px-4 mt-8 mb-10">
          <h3 className="text-lg font-semibold mb-4 text-white">Location</h3>
          <div className="bg-[#181c0c] border border-[#333627] overflow-hidden rounded-xl shadow-inner">
            <div className="aspect-video w-full relative bg-[#2a2e1c]">
              <VenueMap
                latitude={venue.latitude || -12.0463}
                longitude={venue.longitude || -77.0427}
              />
            </div>
            <div className="p-4 border-t border-[#333627]">
              <p className="text-sm font-medium text-[#e2e4cf]">{venue.name}</p>
              <p className="text-xs text-[#a1a68d] mt-1">{venue.address}</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

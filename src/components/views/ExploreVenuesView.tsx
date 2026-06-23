import { VenueResponse } from "@/types/api/venues/venue";
import { LocalCard } from "@/components/dashboard/LocalCard";
import { BottomNav } from "@/components/ui/botton-nav";

interface Props {
  venues: VenueResponse[];
}

export function ExploreVenuesView({ venues }: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#111508] via-[#181c0c] to-[#1f2413] text-white p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#c3f400] tracking-tight">
            Explorar Locales
          </h1>

          <p className="text-[#c4c9ac] mt-3 text-base md:text-lg">
            Encuentra complejos deportivos y reserva tu cancha favorita.
          </p>
        </div>

        {/* Locales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <LocalCard
              key={venue.idVenue}
              venue={venue}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
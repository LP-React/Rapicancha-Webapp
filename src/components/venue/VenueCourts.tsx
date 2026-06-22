import Image from "next/image";
import { SportCourtResponse } from "@/types/api/sport-courts/sportCourt";
import Link from "next/link";

interface VenueCourtsProps {
  courts: SportCourtResponse[];
}

export function VenueCourts({ courts }: VenueCourtsProps) {
  if (!courts || courts.length === 0) {
    return (
      <section className="px-4 mt-8">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Available Courts
        </h3>
        <p className="text-[#a1a68d] text-sm">
          No courts available at this time.
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 mt-8">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Available Courts
      </h3>
      <div className="flex flex-col gap-3">
        {courts.map((court) => {
          // Tomamos la primera imagen de la cancha si existe, si no, un placeholder
          const courtImage =
            court.images && court.images.length > 0
              ? court.images[0].imageUrl
              : "https://placehold.co/400x400/181c0c/333627?text=No+Image";

          return (
            <div
              key={court.idSportCourt}
              className="p-4 rounded-xl flex items-center gap-4 bg-[#181c0c] border border-[#333627]"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                <Image
                  src={courtImage}
                  alt={court.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-base leading-tight">
                  {court.name}
                </h4>
                <p className="text-[#a1a68d] text-xs font-medium mt-0.5">
                  {court.sportType} • {court.surfaceType}
                </p>
                <p className="text-white font-bold text-sm mt-2">
                  S/ {court.rate}/hr
                </p>
              </div>
              <Link
                href={`/local/${court.venueId}/cancha?idCancha=${court.idSportCourt}`}
                className="bg-[#abd600] text-[#111508] px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform text-center"
              >
                Book
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

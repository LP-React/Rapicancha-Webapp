import { notFound } from "next/navigation";
import { SportCourtService } from "@/services/sport-court-service";
import { VenueResponse } from "@/types/api/venues/venue";
import { CourtDetailsView } from "@/components/views/SportCourtDetailsView";

export default async function CourtPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ idCancha: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const idVenue = Number(resolvedParams.id);
  const idCancha = Number(resolvedSearchParams.idCancha);

  if (isNaN(idVenue) || isNaN(idCancha)) return notFound();

  // 1. Obtener datos del Venue (para saber los horarios openTime/closeTime)
  const venueRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/venues?idVenue=${idVenue}`,
    { cache: "no-store" },
  );
  if (!venueRes.ok) return notFound();

  const venues: VenueResponse[] = await venueRes.json();
  const venue = venues[0];
  if (!venue) return notFound();

  // 2. Obtener todas las canchas del local y filtrar la que queremos
  const allCourts = await SportCourtService.getByVenue(idVenue);
  const selectedCourt = allCourts.find((c) => c.idSportCourt === idCancha);

  if (!selectedCourt) return notFound();

  return <CourtDetailsView court={selectedCourt} venue={venue} />;
}

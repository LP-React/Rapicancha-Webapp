import { notFound } from "next/navigation";
import { SportCourtService } from "@/services/sport-court-service";
import { VenueResponse } from "@/types/api/venues/venue";
import { VenueDetailsView } from "@/components/views/VenueDetailsView";

export default async function VenuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const idVenue = Number(resolvedParams.id);

  if (isNaN(idVenue)) {
    return notFound();
  }

  const venueRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/venues/${idVenue}`,
    {
      cache: "no-store",
    }
  );

  if (!venueRes.ok) {
    return notFound();
  }

  const venue: VenueResponse = await venueRes.json();

  if (!venue) {
    return notFound();
  }

  const courts = await SportCourtService.getByVenue(idVenue);

  return (
    <VenueDetailsView
      venue={venue}
      courts={courts}
    />
  );
}
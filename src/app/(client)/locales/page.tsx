import { ExploreVenuesView } from "@/components/views/ExploreVenuesView";
import { VenueResponse } from "@/types/api/venues/venue";

export default async function LocalesPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/venues`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return <div>Error cargando locales</div>;
  }

  const venues: VenueResponse[] =
    await response.json();

  return (
    <ExploreVenuesView
      venues={venues}
    />
  );
}
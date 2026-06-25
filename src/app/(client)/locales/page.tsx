import { ExploreVenuesView } from "@/components/views/ExploreVenuesView";
import { VenueResponse } from "@/types/api/venues/venue";
import { http } from "@/lib/http";

export default async function LocalesPage() {
  try {
    const venues = await http<VenueResponse[]>("/api/venues", {
      cache: "no-store",
    });

    return (
      <ExploreVenuesView
        venues={venues}
      />
    );
  } catch (error) {
    console.error("Error al cargar los locales:", error);
    return <div>Error cargando locales</div>;
  }
}
import { Metadata } from "next";
import { VenueService } from "@/services/venue-service";
import { LocalesView } from "@/components/views/LocalesView";

export const metadata: Metadata = {
  title: "Locales - RapiCancha",
  description: "Gestiona tus sedes y complejos deportivos.",
};

export default async function LocalesPage() {
  const venues = await VenueService.getAll();

  return <LocalesView venues={venues} />;
}

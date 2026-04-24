import { Metadata } from "next";
import { cookies } from "next/headers";
import { VenueService } from "@/services/venue-service";
import { LocalesView } from "@/components/views/LocalesView";

export const metadata: Metadata = {
  title: "Locales - RapiCancha",
  description: "Gestiona tus sedes y complejos deportivos.",
};

export default async function LocalesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_user");

  try {
    const userData = JSON.parse(sessionCookie?.value || "{}");
    const venues = await VenueService.getAll({ ownerId: userData.accountId });

    return <LocalesView venues={venues} />;
  } catch (error) {
    console.error("Error en LocalesPage:", error);
    return <LocalesView venues={[]} />;
  }
}

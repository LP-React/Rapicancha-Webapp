import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VenueService } from "@/services/venue-service";
import { LocalesView } from "@/components/views/LocalesView";

export const metadata: Metadata = {
  title: "Locales - RapiCancha",
  description: "Gestiona tus sedes y complejos deportivos.",
};

export default async function LocalesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_user");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const userData = JSON.parse(sessionCookie.value);
    const ownerId = userData.accountId;
    const venues = await VenueService.getAll({ ownerId });

    return <LocalesView venues={venues} />;
  } catch (error) {
    console.error("Error al parsear la sesión:", error);
    redirect("/login");
  }
}

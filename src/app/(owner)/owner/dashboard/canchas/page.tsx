import { Metadata } from "next";
import { cookies } from "next/headers";
import { VenueService } from "@/services/venue-service";
import { CanchasView } from "@/components/views/CanchasView";

export const metadata: Metadata = {
  title: "Mis Canchas - RapiCancha",
  description: "Administra las canchas de tus locales deportivos.",
};

export default async function CanchasPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_user");

  try {
    const userData = JSON.parse(sessionCookie?.value || "{}");
    const ownerId = userData.accountId;
    const venues = await VenueService.getAll({ ownerId });

    return <CanchasView venues={venues} />;
  } catch (error) {
    console.error("Error en CanchasPage:", error);
    return <CanchasView venues={[]} />;
  }
}

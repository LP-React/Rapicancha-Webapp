import { Metadata } from "next";
import { cookies } from "next/headers";
import { VenueService } from "@/services/venue-service";
import { ReservasView } from "@/components/views/ReservasView";

export const metadata: Metadata = {
  title: "Reservas - RapiCancha",
  description: "Visualiza y gestiona el calendario de reservas de tus canchas.",
};

export default async function ReservasPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_user");

  try {
    const userData = JSON.parse(sessionCookie?.value || "{}");
    const ownerId = userData.accountId;

    if (!ownerId) {
      throw new Error("No se encontró el ID del propietario en la sesión");
    }

    const venuesWithCourts = await VenueService.getVenuesAndCourts(ownerId);

    return <ReservasView venuesData={venuesWithCourts} />;
  } catch (error) {
    console.error("Error en ReservasPage:", error);
    return <ReservasView venuesData={[]} />;
  }
}

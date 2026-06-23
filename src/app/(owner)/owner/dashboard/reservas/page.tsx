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
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error en ReservasPage:", message);
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-md">
          <h2 className="text-xl font-bold mb-2">Error al cargar reservas</h2>
          <p className="text-sm opacity-80 mb-4">{message}</p>
          <p className="text-xs opacity-60">Verifica que los microservicios estén corriendo (mcsv-court en :8083 y gateway en :8080).</p>
        </div>
      </div>
    );
  }
}

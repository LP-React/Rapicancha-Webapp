import { Metadata } from "next";
import { cookies } from "next/headers";
import { BookingService } from "@/services/booking-service";
import { SuccessCheckInView } from "@/components/views/SuccessCheckInView";
import { AuthRequiredView } from "@/components/views/AuthRequiredView";
import { ErrorCheckInView } from "@/components/views/ErrorCheckInView";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Check-in - ${code} | Pavilion Sports`,
    description: "Confirma tu ingreso a las instalaciones de Pavilion Sports.",
  };
}

export default async function CheckInPage({ params }: Props) {
  const { code: qrCode } = await params;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_user");

  if (!sessionCookie) {
    return <AuthRequiredView qrCode={qrCode} />;
  }

  try {
    const userData = JSON.parse(sessionCookie.value);
    const ownerId = userData.accountId;

    if (!ownerId) {
      throw new Error("No se pudo obtener el ID de la cuenta.");
    }

    const bookingData = await BookingService.checkIn(qrCode, ownerId);

    return <SuccessCheckInView data={bookingData} />;
  } catch (error: any) {
    const errorMessage =
      error instanceof SyntaxError
        ? "Error en el formato de sesión"
        : error.message || "Error al procesar el check-in";

    return <ErrorCheckInView message={errorMessage} />;
  }
}

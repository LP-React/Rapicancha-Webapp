import { LoginView } from "@/components/views/LoginView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión - RapiCancha",
  description:
    "Accede a tu cuenta en RapiCancha para gestionar tus sedes y reservas.",
};

export default function LoginPage() {
  return <LoginView />;
}

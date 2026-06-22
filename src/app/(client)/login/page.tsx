import LoginUserView from "@/components/views/LoginUserView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rapicancha - Login",
  description: "Ingresa para asegurar tu cancha.",
};

export default function LoginPage() {
  return <LoginUserView />;
}

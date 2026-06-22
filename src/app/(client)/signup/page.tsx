import SignupView from "@/components/views/SignupUserView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rapicancha - Signup",
  description: "Ingresa para asegurar tu cancha.",
};

export default function LoginPage() {
  return <SignupView />;
}

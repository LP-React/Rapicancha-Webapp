import { SignupView } from "@/components/views/SignupView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crea tu cuenta - RapiCancha",
  description: "Crea tu cuenta en RapiCancha.",
};

export default function SignupPage() {
  return <SignupView />;
}

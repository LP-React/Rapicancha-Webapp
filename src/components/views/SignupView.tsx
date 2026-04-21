import { AuthHero } from "@/components/auth/AuthHero";
import { SignupForm } from "@/components/auth/SignupForm";

export function SignupView() {
  return (
    <main className="flex min-h-screen">
      <AuthHero />
      <section className="w-full lg:w-1/2 bg-surface flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        <SignupForm />
      </section>
    </main>
  );
}

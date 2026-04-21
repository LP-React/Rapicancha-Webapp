import { AuthHero } from "@/components/auth/AuthHero";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginView() {
  return (
    <main className="flex min-h-screen w-full bg-background">
      <AuthHero />
      <section className="w-full lg:w-1/2 bg-surface flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        <LoginForm />
      </section>
    </main>
  );
}

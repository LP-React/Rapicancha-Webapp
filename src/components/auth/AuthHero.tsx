import Image from "next/image";
import { Hexagon } from "lucide-react";

export function AuthHero() {
  return (
    <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/signup/stadium.png"
          alt="Modern stadium arena"
          width={512}
          height={512}
          className="object-cover h-full w-full"
          priority
        />
        <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 custom-gradient rounded-lg flex items-center justify-center">
          <Hexagon className="text-white fill-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          RapiCancha
        </span>
      </div>

      <div className="relative z-10 max-w-md">
        <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
          Redefiniendo <br />
          <span className="text-primary-container">
            la Gestión de Reservas.
          </span>
        </h1>
        <p className="text-gray-200 text-lg leading-relaxed">
          Ahorra tiempo en gestion de reservas manuales y gana más reservas en
          tus locales deportivos.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-8 text-white">
        <Stat label="Locales" value="100+" />
        <Stat label="Miembros" value="50k+" />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-300 uppercase tracking-widest font-semibold">
        {label}
      </div>
    </div>
  );
}

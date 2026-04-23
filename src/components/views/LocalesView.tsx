import { VenueResponse } from "@/types/api/venues/venue";
import { LocalCard } from "@/components/dashboard/LocalCard";
import { VenueInsights } from "@/components/dashboard/VenueInsights";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AddVenueDialog } from "../dashboard/AddVenueDialog";
import { Plus } from "lucide-react";

interface LocalesViewProps {
  venues: VenueResponse[];
}

export function LocalesView({ venues }: LocalesViewProps) {
  const isLoading = !venues;

  return (
    <main className="p-6 md:p-12 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Locales
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Administra tus centros deportivos y supervisa tu red de locales.
            </p>
          </div>
          <AddVenueDialog />
        </div>
      </section>

      {/* Carousel Section - Locales */}
      <section className="relative px-4 md:px-0">
        <Carousel
          opts={{
            align: "start",
            loop: venues.length > 0,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {venues.length > 0 ? (
              venues.map((venue) => (
                <CarouselItem
                  key={venue.idVenue}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <LocalCard venue={venue} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <AddVenueDialog
                  trigger={
                    <div className="w-80 h-[400px] group flex flex-col items-center justify-center gap-4 bg-gray-50 border-2 border-dashed border-outline-variant/30 rounded-3xl hover:bg-white hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={32} className="text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-on-surface uppercase tracking-tight">
                          Registrar mi primer local
                        </p>
                        <p className="text-sm text-on-surface-variant mt-1">
                          Haz click aquí para empezar
                        </p>
                      </div>
                    </div>
                  }
                />
              </CarouselItem>
            )}
          </CarouselContent>

          {/* Solo mostrar flechas si hay más de 3 locales (o según tu breakpoint) */}
          {venues.length > 3 && (
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 border-outline-variant/20 hover:bg-primary hover:text-white" />
              <CarouselNext className="-right-12 border-outline-variant/20 hover:bg-primary hover:text-white" />
            </div>
          )}
        </Carousel>
      </section>

      <VenueInsights venues={venues} isLoading={isLoading} />
    </main>
  );
}

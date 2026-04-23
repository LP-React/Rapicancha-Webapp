import { VenueResponse } from "@/types/api/venues/venue";
import { LocalCard } from "@/components/dashboard/LocalCard";
import { VenueInsights } from "@/components/dashboard/VenueInsights";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
          <Button
            size="lg"
            className="custom-gradient rounded-xl font-bold h-12 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Plus className="mr-2 h-5 w-5" /> Agregar local
          </Button>
        </div>
      </section>

      {/* Carousel Section - Locales */}
      <section className="relative px-4 md:px-0">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {venues.map((venue) => (
              <CarouselItem
                key={venue.idVenue}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <LocalCard venue={venue} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12 border-outline-variant/20 hover:bg-primary hover:text-white" />
            <CarouselNext className="-right-12 border-outline-variant/20 hover:bg-primary hover:text-white" />
          </div>
        </Carousel>
      </section>

      <VenueInsights venues={venues} isLoading={isLoading} />
    </main>
  );
}

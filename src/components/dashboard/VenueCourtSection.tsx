"use client";

import React, { useEffect, useState } from "react";
import { Building2, Trophy, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SportCourtResponse } from "@/types/api/sport-courts/sportCourt";
import { SportCourtService } from "@/services/sport-court-service";
import { SportCourtCard } from "./SportCourtCard";
import { AddSportCourtDialog } from "../dashboard/AddSportCourtDialog";

interface Props {
  venueId: number;
  venueName: string;
}

export function VenueCourtsSection({ venueId, venueName }: Props) {
  const [courts, setCourts] = useState<SportCourtResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Esta función se ejecuta al cargar y cada vez que router.refresh()
  // gatille cambios si los datos vienen de una Server Action o similar.
  const loadCourts = async () => {
    try {
      const data = await SportCourtService.getByVenue(venueId);
      setCourts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourts();
  }, [venueId]);

  if (loading)
    return (
      <div className="space-y-4 mb-16">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 animate-pulse rounded-3xl"
            />
          ))}
        </div>
      </div>
    );

  return (
    <section className="animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-on-surface tracking-tight leading-none uppercase">
              {venueName}
            </h3>
            <p className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-widest">
              {courts.length} Instalaciones registradas
            </p>
          </div>
        </div>

        <AddSportCourtDialog
          venueId={venueId}
          venueName={venueName}
          onSuccess={loadCourts}
          trigger={
            <div className="flex items-center gap-2 bg-surface-container-high hover:bg-primary hover:text-white text-on-surface px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-tight transition-all cursor-pointer border border-outline-variant/20 active:scale-95 shadow-sm">
              <Plus size={18} />
              <span className="hidden md:inline">Añadir Cancha</span>
            </div>
          }
        />
      </div>

      <div className="relative">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {courts.length > 0 ? (
              courts.map((court) => (
                <CarouselItem
                  key={court.idSportCourt}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <SportCourtCard court={court} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="pl-4 basis-full">
                <div className="h-64 flex flex-col items-center justify-center bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-[2rem]">
                  <Trophy size={40} className="text-outline-variant/40 mb-3" />
                  <p className="text-on-surface-variant font-bold uppercase text-sm mb-4">
                    Sin canchas en este local
                  </p>
                  <AddSportCourtDialog
                    venueId={venueId}
                    venueName={venueName}
                    trigger={
                      <div className="flex items-center gap-2 text-primary font-bold hover:underline cursor-pointer uppercase text-xs tracking-widest">
                        Registrar la primera cancha <Plus size={14} />
                      </div>
                    }
                  />
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {courts.length > 3 && (
            <>
              <CarouselPrevious className="-left-12 border-none bg-white shadow-xl" />
              <CarouselNext className="-right-12 border-none bg-white shadow-xl" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}

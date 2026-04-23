"use client";

import { VenueResponse } from "@/types/api/venues/venue";
import { MapPin, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface LocalCardProps {
  venue: VenueResponse;
}

export function LocalCard({ venue }: LocalCardProps) {
  const isCurrentlyOpen = useMemo(() => {
    if (!venue.openTime || !venue.closeTime) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = venue.openTime.split(":").map(Number);
    const [closeH, closeM] = venue.closeTime.split(":").map(Number);

    const openMinutes = openH * 60 + openM;
    let closeMinutes = closeH * 60 + closeM;

    if (closeMinutes <= openMinutes) {
      closeMinutes += 24 * 60;
    }

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }, [venue.openTime, venue.closeTime]);

  const statusLabel = isCurrentlyOpen ? "Abierto ahora" : "Cerrado";

  return (
    <div
      className={cn(
        "group flex flex-col h-full bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-500 border border-outline-variant/10 hover:shadow-2xl hover:border-primary/20",
        !isCurrentlyOpen && "grayscale-[0.4] opacity-90",
      )}
    >
      {/* Header de Imagen */}
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={
            venue.bannerImageUrl ||
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000"
          }
          alt={venue.name}
        />

        <div className="absolute top-4 right-4">
          <Badge
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md border-none shadow-sm flex items-center gap-1.5",
              isCurrentlyOpen
                ? "bg-emerald-500/90 text-white"
                : "bg-red-500/90 text-white",
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isCurrentlyOpen ? "bg-white" : "bg-white",
              )}
            />
            {statusLabel}
          </Badge>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-2xl font-bold text-on-surface truncate tracking-tight uppercase">
              {venue.name === "true" ? "Local sin nombre" : venue.name}
            </h3>
            {venue.is_active && (
              <CheckCircle2 className="w-5 h-5 fill-primary text-white shrink-0" />
            )}
          </div>

          <div className="flex items-center text-on-surface-variant text-sm">
            <Clock className="w-4 h-4 mr-1.5 text-primary shrink-0" />
            <span className="font-medium">
              {venue.openTime.slice(0, 5)} - {venue.closeTime.slice(0, 5)}
            </span>
          </div>

          <div className="flex items-start text-on-surface-variant text-sm group-hover:text-on-surface transition-colors">
            <MapPin className="w-4 h-4 mr-1.5 text-primary shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-snug">
              {venue.address === "true"
                ? "Dirección no disponible"
                : venue.address}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 border-t border-outline-variant/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                  Canchas
                </span>
                <span className="text-xl font-extrabold text-primary">
                  {20}
                </span>
              </div>

              <div className="flex flex-col border-l border-outline-variant/20 pl-4">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  Capacidad
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {venue.maxCapacity || "--"}
                </span>
              </div>
            </div>

            <button className="w-11 h-11 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary hover:scale-110 transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

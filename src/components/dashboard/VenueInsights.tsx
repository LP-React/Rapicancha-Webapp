"use client";

import { VenueResponse } from "@/types/api/venues/venue";
import { Info, LayoutDashboard } from "lucide-react";
import { useMemo } from "react";

interface VenueInsightsProps {
  venues?: VenueResponse[];
  isLoading?: boolean;
}

export function VenueInsights({ venues = [], isLoading }: VenueInsightsProps) {
  const stats = useMemo(() => {
    if (!venues || venues.length === 0) return null;

    const total = venues.length;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const openNowCount = venues.filter((v) => {
      if (!v.openTime || !v.closeTime) return false;

      const [oH, oM] = v.openTime.split(":").map(Number);
      const [cH, cM] = v.closeTime.split(":").map(Number);

      const openMinutes = oH * 60 + oM;
      let closeMinutes = cH * 60 + cM;

      if (closeMinutes <= openMinutes) {
        closeMinutes += 24 * 60;
      }

      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    }).length;

    const totalHoursRaw = venues.reduce((acc, v) => {
      const [oH, oM] = (v.openTime || "00:00:00").split(":").map(Number);
      const [cH, cM] = (v.closeTime || "00:00:00").split(":").map(Number);
      let diff = cH * 60 + cM - (oH * 60 + oM);
      if (diff <= 0) diff += 24 * 60;
      return acc + diff;
    }, 0);

    const avgHours = Math.round(totalHoursRaw / total / 60);

    const fullServiceVenues = venues.filter(
      (v) => v.hasParking && v.hasRestroom && v.hasShower,
    ).length;

    const avgCapacity = Math.round(
      venues.reduce((acc, v) => acc + (v.maxCapacity || 0), 0) / total,
    );

    return {
      openNowCount,
      total,
      avgHours,
      fullServiceVenues,
      avgCapacity,
      activePercent: (openNowCount / total) * 100,
    };
  }, [venues]);

  // 1. Estado de Carga
  if (isLoading || (!venues.length && !stats)) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 animate-pulse">
        <div className="lg:col-span-3 h-64 bg-surface-container-low rounded-2xl border border-outline-variant/10" />
      </div>
    );
  }

  // 2. Estado Sin Datos
  if (venues.length === 0) {
    return (
      <div className="mt-12 p-10 border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center text-on-surface-variant">
        <LayoutDashboard className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-medium">
          No hay locales registrados para generar insights.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
      <div className="lg:col-span-3 group flex flex-col md:flex-row bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
        {/* Lado Izquierdo: Título y Contexto */}
        <div className="w-full md:w-2/5 p-10 flex flex-col justify-center space-y-4 border-b md:border-b-0 md:border-r border-outline-variant/10">
          <div className="space-y-1">
            <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Estado actual
            </span>
            <h3 className="text-3xl font-extrabold text-on-surface">
              Resumen de tus locales
            </h3>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Basado en el horario actual y la infraestructura de tus{" "}
            {stats?.total} sedes.
          </p>
        </div>

        {/* Lado Derecho: Stats Grilla */}
        <div className="w-full md:w-3/5 p-10 grid grid-cols-2 gap-8 bg-white/40 backdrop-blur-sm">
          {/* Locales Abiertos Ahora */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
              Abiertos Ahora
            </span>
            <p className="text-3xl font-extrabold text-primary">
              {stats?.openNowCount} / {stats?.total}
            </p>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${stats?.activePercent}%` }}
              ></div>
            </div>
          </div>

          {/* Capacidad Promedio */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
              Capacidad Prom.
            </span>
            <p className="text-3xl font-extrabold text-on-surface">
              {stats?.avgCapacity} pers.
            </p>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-2">
              <div className="h-full bg-secondary w-[70%]" />
            </div>
          </div>

          {/* Horas Operativas Promedio */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
              Horas Op. Prom.
            </span>
            <p className="text-3xl font-extrabold text-on-surface">
              {stats?.avgHours} hrs
            </p>
            <p className="text-[10px] text-on-surface-variant italic">
              Por local registrado
            </p>
          </div>

          {/* Cobertura de Servicios */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
              Servicios Full
            </span>
            <p className="text-3xl font-extrabold text-on-surface">
              {stats?.fullServiceVenues} / {stats?.total}
            </p>
            <p className="text-[10px] text-on-surface-variant italic">
              Cochera + Baño + Ducha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

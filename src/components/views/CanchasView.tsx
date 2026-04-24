"use client";

import React from "react";
import { VenueResponse } from "@/types/api/venues/venue";
import { Plus, LayoutGrid } from "lucide-react";
import { VenueCourtsSection } from "../dashboard/VenueCourtSection";
import { AddSportCourtDialog } from "../dashboard/AddSportCourtDialog";

interface CanchasViewProps {
  venues: VenueResponse[];
}

export function CanchasView({ venues }: CanchasViewProps) {
  return (
    <main className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-16">
      {/* Header Section - Estilo similar a LocalView */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Mis <span className="text-primary">Canchas</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Visualiza y gestiona el inventario de canchas por cada sede
              activa.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Locales y sus Canchas */}
      <div className="space-y-24">
        {venues.length > 0 ? (
          venues.map((venue) => (
            <VenueCourtsSection
              key={venue.idVenue}
              venueId={venue.idVenue}
              venueName={venue.name}
            />
          ))
        ) : (
          /* Empty State con el estilo de LocalView */
          <div className="flex justify-center py-12">
            <div className="w-full max-w-md p-12 flex flex-col items-center justify-center gap-6 bg-gray-50 border-2 border-dashed border-outline-variant/30 rounded-[3rem] text-center">
              <div className="w-20 h-20 rounded-full bg-gray-200/50 flex items-center justify-center">
                <LayoutGrid size={40} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xl font-black text-on-surface uppercase tracking-tight">
                  No hay sedes activas
                </p>
                <p className="text-on-surface-variant mt-2 font-medium">
                  Primero debes registrar un local para poder gestionar sus
                  canchas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

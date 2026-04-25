"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  HOURS,
  HOUR_HEIGHT,
  getWeekDays,
  START_HOUR,
} from "@/lib/calendar-utils";
import { BookingCard } from "./BookingCard";
import { cn } from "@/lib/utils";

export function BookingsCalendar({
  bookings,
  weekStart,
}: {
  bookings: any[];
  weekStart: Date;
}) {
  const weekDays = getWeekDays(weekStart);
  const [now, setNow] = useState(new Date());

  // Actualización del segundero para precisión máxima
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Memorizamos la posición para evitar re-cálculos innecesarios en cada render
  const markerTop = useMemo(() => {
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    if (currentHour < START_HOUR || currentHour > 23) return null;

    const totalMinutes = (currentHour - START_HOUR) * 60 + currentMinutes;
    return (totalMinutes / 60) * HOUR_HEIGHT;
  }, [now]);

  return (
    <section className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-2xl">
      <div className="grid grid-cols-8 border-b border-outline-variant/20 bg-surface-container-low/40">
        <div className="p-4 border-r border-outline-variant/20 flex items-center justify-center bg-surface-container-low">
          <span className="text-[10px] font-black text-black uppercase tracking-widest">
            Hora
          </span>
        </div>
        {weekDays.map((day) => (
          <div
            key={day.date.toISOString()}
            className={cn(
              "p-5 flex flex-col items-center border-r border-outline-variant/20 last:border-0",
              day.isToday && "bg-primary/5",
            )}
          >
            <span
              className={cn(
                "text-[11px] font-bold",
                day.isToday ? "text-primary" : "text-primary/60",
              )}
            >
              {day.name}
            </span>
            <span
              className={cn(
                "text-xl font-black",
                day.isToday ? "text-primary" : "text-on-surface",
              )}
            >
              {day.dayNumber}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 relative overflow-y-auto max-h-[800px] scrollbar-hide bg-surface-container-lowest">
        {/* COLUMNA DE HORAS */}
        <div className="col-span-1 border-r border-outline-variant/20 z-20 bg-white">
          {HOURS.map((hour) => (
            <div
              key={hour}
              style={{ height: HOUR_HEIGHT }}
              className="p-2 text-right border-b border-outline-variant/5"
            >
              <span className="text-[11px] font-bold text-outline/70">
                {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </span>
            </div>
          ))}
        </div>

        {/* ÁREA DE CONTENIDO */}
        <div className="col-span-7 grid grid-cols-7 relative bg-slate-50/20">
          {/* GRID DE FONDO */}
          <div className="absolute inset-0 pointer-events-none">
            {HOURS.map((hour) => (
              <div
                key={hour}
                style={{ height: HOUR_HEIGHT }}
                className="border-b border-outline-variant/10 w-full"
              />
            ))}
            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day) => (
                <div
                  key={`line-${day.date}`}
                  className={cn(
                    "border-r border-outline-variant/10 h-full",
                    day.isToday && "bg-primary/[0.02]",
                  )}
                />
              ))}
            </div>
          </div>

          {/* RESERVAS */}
          {bookings.map((booking) => (
            <BookingCard key={booking.idBooking} booking={booking} />
          ))}

          {/* --- INDICADOR DE HORA ACTUAL "LIVE" --- */}
          {markerTop !== null && (
            <div
              className="absolute left-0 w-full z-50 pointer-events-none transition-all duration-1000 ease-linear"
              style={{ top: `${markerTop}px` }}
            >
              <div className="relative flex items-center">
                {/* Etiqueta de hora flotante */}
                <div className="absolute -left-1 transform -translate-x-full pr-2">
                  <div className="bg-black text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold shadow-sm">
                    {now.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Círculo indicador con pulso */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-3 h-3 bg-error rounded-full animate-ping opacity-40" />
                  <div className="w-2.5 h-2.5 bg-error rounded-full border-2 border-white shadow-sm" />
                </div>

                {/* Línea horizontal sólida y degradada */}
                <div className="flex-grow h-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

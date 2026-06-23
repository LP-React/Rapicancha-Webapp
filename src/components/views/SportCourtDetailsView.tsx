"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Users,
  Trophy,
  Sprout,
  Lightbulb,
  Umbrella,
  Gavel,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { SportCourtResponse } from "@/types/api/sport-courts/sportCourt";
import { VenueResponse } from "@/types/api/venues/venue";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

import { BookingService } from "@/services/booking-service";

interface CourtDetailsViewProps {
  court: SportCourtResponse;
  venue: VenueResponse;
}

function generateTimeSlots(
  openTime: string,
  closeTime: string,
  slotMinutes: number,
) {
  const slots: string[] = [];
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);

  let currentMinutes = openH * 60 + openM;
  const endMinutes = closeH * 60 + closeM;

  while (currentMinutes + slotMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const displayM = m.toString().padStart(2, "0");

    slots.push(`${displayH}:${displayM} ${ampm}`);
    currentMinutes += slotMinutes;
  }

  return slots;
}

export function CourtDetailsView({ court, venue }: CourtDetailsViewProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const handleBooking = async () => {
    if (loading || isBooking) return;

    if (!user) {
      toast("Debes iniciar sesión para reservar", {
        description: "Elige una opción para continuar:",
        action: {
          label: "Iniciar Sesión",
          onClick: () => router.push("/login"),
        },
        cancel: {
          label: "Registrarse",
          onClick: () => router.push("/signup"),
        },
        duration: 8000,
      });
      return;
    }

    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      const targetDate = new Date();
      if (selectedSlot.date === "tomorrow") {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      const dateString = targetDate.toISOString().split("T")[0];

      const timeParts = selectedSlot.time.match(/(\d+):(\d+)\s+(AM|PM)/);
      let startH = 0, startM = 0;
      if (timeParts) {
        startH = parseInt(timeParts[1]);
        startM = parseInt(timeParts[2]);
        if (timeParts[3] === "PM" && startH < 12) startH += 12;
        if (timeParts[3] === "AM" && startH === 12) startH = 0;
      }

      const startTimeStr = `${startH.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")}:00`;

      let endMinutes = startH * 60 + startM + court.slotMinutes;
      let endH = Math.floor(endMinutes / 60);
      let endM = endMinutes % 60;
      const endTimeStr = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}:00`;

      await BookingService.create({
        sportCourtId: court.idSportCourt,
        customerAccountId: user.accountId,
        date: dateString,
        startTime: startTimeStr,
        endTime: endTimeStr,
        price: court.rate,
      });

      toast.success("¡Reserva confirmada con éxito!");
      setSelectedSlot(null);
    } catch (error: any) {
      toast.error(error.message || "Error al procesar la reserva");
    } finally {
      setIsBooking(false);
    }
  };

  // Formatear fechas para los títulos
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDay = (date: Date) =>
    `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;

  const todayStr = formatDay(today);
  const tomorrowStr = formatDay(tomorrow);

  // Generar slots basados en el venue y la cancha
  const availableSlots = generateTimeSlots(
    venue.openTime,
    venue.closeTime,
    court.slotMinutes,
  );

  return (
    <div className="bg-[#111508] text-[#e2e4cf] min-h-screen overflow-x-hidden selection:bg-[#c3f400] selection:text-[#161e00]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 flex justify-between items-center w-full px-5 h-16">
        <button
          onClick={() => router.back()}
          className="active:scale-95 transition-transform duration-150 hover:opacity-80"
        >
          <ArrowLeft className="text-[#CCFF00] w-6 h-6" />
        </button>
        <h1 className="font-bold tracking-tight text-white text-lg">
          Court Details
        </h1>
        <button className="active:scale-95 transition-transform duration-150 hover:opacity-80">
          <Heart className="text-[#CCFF00] w-6 h-6" />
        </button>
      </header>

      <main className="pb-32">
        {/* Hero Section with Horizontal Carousel */}
        <section className="relative w-full aspect-[4/3] overflow-hidden group">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-full w-full">
            {court.images && court.images.length > 0 ? (
              court.images.map((img, idx) => (
                <div
                  key={img.idSportCourtImage}
                  className="flex-none w-full h-full snap-center relative"
                >
                  <img
                    alt={`${court.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    src={img.imageUrl}
                  />
                </div>
              ))
            ) : (
              <div className="flex-none w-full h-full snap-center relative bg-[#181c0c] flex items-center justify-center">
                <span className="text-[#8e9379]">No images available</span>
              </div>
            )}
          </div>
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {court.images?.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === 0 ? "bg-[#abd600]" : "bg-white/50"}`}
              ></div>
            ))}
          </div>
        </section>

        {/* Content Container */}
        <div className="px-5 mt-6 relative z-10 space-y-6">
          {/* Header Section */}
          <section className="space-y-2">
            {court.isActive && (
              <span className="inline-block bg-[#c3f400] text-[#161e00] text-[13px] font-medium px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Available
              </span>
            )}
            <h2 className="text-[34px] leading-10 font-bold text-white tracking-tight">
              {court.name}
            </h2>
          </section>

          {/* Quick Stats Bento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1e2113] p-4 rounded-xl border border-[#444933]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#333627] flex items-center justify-center text-[#c3f400]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[#c4c9ac] text-[11px] uppercase tracking-widest font-medium">
                  Capacity
                </p>
                <p className="text-[22px] font-semibold text-[#c3f400]">
                  {court.capacity}
                </p>
              </div>
            </div>
            <div className="bg-[#1e2113] p-4 rounded-xl border border-[#444933]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#333627] flex items-center justify-center text-[#c3f400]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[#c4c9ac] text-[11px] uppercase tracking-widest font-medium">
                  Sport
                </p>
                <p className="text-[22px] font-semibold text-[#c3f400]">
                  {court.sportType}
                </p>
              </div>
            </div>
          </div>

          {/* Court Attributes Tiles */}
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-[#1a1d10] p-2 rounded-lg border border-[#444933]/20 flex flex-col items-center text-center">
              <Sprout className="text-[#c4c9ac] w-6 h-6 mb-1" />
              <span className="text-[12px] font-medium text-[#e2e4cf]">
                {court.surfaceType}
              </span>
            </div>
            <div
              className={`bg-[#1a1d10] p-2 rounded-lg border border-[#444933]/20 flex flex-col items-center text-center ${!court.hasLighting && "opacity-50"}`}
            >
              <Lightbulb
                className={`w-6 h-6 mb-1 ${court.hasLighting ? "text-[#c3f400]" : "text-[#c4c9ac]"}`}
              />
              <span className="text-[12px] font-medium text-[#e2e4cf]">
                Lighting: {court.hasLighting ? "Yes" : "No"}
              </span>
            </div>
            <div
              className={`bg-[#1a1d10] p-2 rounded-lg border border-[#444933]/20 flex flex-col items-center text-center ${!court.hasRoof && "opacity-50"}`}
            >
              <Umbrella
                className={`w-6 h-6 mb-1 ${court.hasRoof ? "text-[#c3f400]" : "text-[#c4c9ac]"}`}
              />
              <span className="text-[12px] font-medium text-[#e2e4cf]">
                Roof: {court.hasRoof ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Description */}
          <section className="space-y-2">
            <h3 className="text-[22px] font-semibold text-white">
              Sobre esta cancha
            </h3>
            <p className="text-[17px] text-[#c4c9ac] leading-relaxed">
              {court.description}
            </p>
          </section>

          {/* Rules Section */}
          {court.rules && (
            <section className="bg-[#282b1d]/40 p-4 rounded-xl border-l-4 border-[#c3f400]">
              <div className="flex items-center gap-2 mb-2">
                <Gavel className="text-[#c3f400] w-5 h-5" />
                <h3 className="text-[13px] font-medium text-[#c3f400] uppercase tracking-widest">
                  Reglas del recinto
                </h3>
              </div>
              <p className="text-[17px] text-[#e2e4cf] italic">
                &quot;{court.rules}&quot;
              </p>
            </section>
          )}

          {/* Booking Section */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-semibold text-white">Reservar</h3>
              <CalendarDays className="text-[#c4c9ac] w-6 h-6" />
            </div>

            {/* Block 1: Today */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></div>
                <h4 className="text-[13px] text-[#c4c9ac] uppercase tracking-wide">
                  Selecciona hora hoy {todayStr}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map((time) => {
                  const isSelected =
                    selectedSlot?.date === "today" &&
                    selectedSlot?.time === time;
                  return (
                    <button
                      key={`today-${time}`}
                      onClick={() => setSelectedSlot({ date: "today", time })}
                      className={`py-4 rounded-xl text-[22px] font-semibold transition-all active:scale-95 border
                        ${
                          isSelected
                            ? "bg-[#c3f400] border-[#c3f400] text-[#161e00]"
                            : "bg-[#333627] border-[#444933]/50 text-white hover:border-[#c3f400]"
                        }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Block 2: Tomorrow */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c4c9ac]"></div>
                <h4 className="text-[13px] text-[#c4c9ac] uppercase tracking-wide">
                  Selecciona hora mañana {tomorrowStr}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map((time) => {
                  const isSelected =
                    selectedSlot?.date === "tomorrow" &&
                    selectedSlot?.time === time;
                  return (
                    <button
                      key={`tomorrow-${time}`}
                      onClick={() =>
                        setSelectedSlot({ date: "tomorrow", time })
                      }
                      className={`py-4 rounded-xl text-[22px] font-semibold transition-all active:scale-95 border
                        ${
                          isSelected
                            ? "bg-[#c3f400] border-[#c3f400] text-[#161e00]"
                            : "bg-[#333627] border-[#444933]/50 text-white hover:border-[#c3f400]"
                        }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Footer Action */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800 pb-[env(safe-area-inset-bottom)]">
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[#c4c9ac] text-[11px] uppercase tracking-widest font-medium">
              Total
            </span>
            <span className="text-[28px] font-bold text-white">
              S/ {court.rate.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleBooking} // Llamamos a nuestra función validada
            disabled={!selectedSlot || isBooking}
            className="flex-1 bg-[#c3f400] text-[#161e00] h-14 rounded-xl text-[22px] font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(195,244,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBooking ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-[#161e00] border-t-transparent rounded-full animate-spin"></span>
                Reservando...
              </span>
            ) : selectedSlot ? (
              "Book Now"
            ) : (
              "Select Time"
            )}
            {!isBooking && <ArrowRight className="w-6 h-6" />}
          </button>
        </div>
      </footer>
    </div>
  );
}

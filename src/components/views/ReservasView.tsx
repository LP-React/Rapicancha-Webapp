"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Trophy,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingsCalendar } from "../dashboard/BookingsCalendar";
import { BookingService } from "@/services/booking-service";
import { getStartOfWeek, formatWeekRange } from "@/lib/calendar-utils";
import { VenueWithCourtsResponse } from "@/types/api/venues/venue";
import { cn } from "@/lib/utils";

// --- COMPONENTE COMBOBOX PERSONALIZADO ---
function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
}: {
  label: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: any;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="text-[10px] font-bold uppercase ml-1 opacity-50 text-slate-500">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-[240px] items-center justify-between gap-2 rounded-xl border border-outline-variant/30 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:bg-slate-50",
          isOpen && "border-primary ring-2 ring-primary/10",
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon className="text-primary shrink-0" size={16} />
          <span
            className={cn(
              "truncate",
              !selectedOption && "text-muted-foreground font-normal",
            )}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-outline-variant/30 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-60 overflow-y-auto">
            {options.length > 0 ? (
              options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-slate-100",
                    value === opt.id
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-slate-700",
                  )}
                >
                  {opt.name}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-muted-foreground italic">
                No hay opciones disponibles
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- VISTA PRINCIPAL ---
export function ReservasView({
  venuesData,
}: {
  venuesData: VenueWithCourtsResponse[];
}) {
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getStartOfWeek(new Date()),
  );

  // Mapeo de locales para el CustomSelect
  const venueOptions = useMemo(
    () => venuesData.map((v) => ({ id: v.idVenue.toString(), name: v.name })),
    [venuesData],
  );

  // Mapeo de canchas para el CustomSelect
  const courtOptions = useMemo(() => {
    if (!selectedVenueId) return [];
    const venue = venuesData.find(
      (v) => v.idVenue.toString() === selectedVenueId,
    );
    return venue
      ? venue.sport_courts.map((c) => ({
          id: c.idSportCourt.toString(),
          name: c.name,
        }))
      : [];
  }, [selectedVenueId, venuesData]);

  useEffect(() => {
    const loadBookings = async (courtId: string) => {
      setIsLoading(true);
      try {
        const data = await BookingService.getBySportCourt(Number(courtId));
        setBookings(data);
      } catch (error) {
        console.error("Error cargando reservas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCourtId) {
      loadBookings(selectedCourtId);
    } else {
      setBookings([]);
    }
  }, [selectedCourtId]);

  const filteredBookings = useMemo(() => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 7);
    return bookings.filter((b) => {
      const d = new Date(b.date + "T00:00:00");
      return d >= currentWeekStart && d < weekEnd;
    });
  }, [currentWeekStart, bookings]);

  return (
    <main className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tight italic uppercase text-primary">
            Agenda
          </h2>
          <div className="flex flex-wrap gap-4 mt-4">
            <CustomSelect
              label="Local"
              options={venueOptions}
              value={selectedVenueId}
              placeholder="Seleccionar Local"
              icon={MapPin}
              onChange={(val) => {
                setSelectedVenueId(val);
                setSelectedCourtId("");
              }}
            />

            <CustomSelect
              label="Cancha"
              options={courtOptions}
              value={selectedCourtId}
              placeholder="Seleccionar Cancha"
              icon={Trophy}
              disabled={!selectedVenueId}
              onChange={(val) => setSelectedCourtId(val)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-outline-variant/20 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const d = new Date(currentWeekStart);
              d.setDate(d.getDate() - 7);
              setCurrentWeekStart(d);
            }}
            className="rounded-xl"
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-sm font-bold min-w-[150px] text-center">
            {formatWeekRange(currentWeekStart)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const d = new Date(currentWeekStart);
              d.setDate(d.getDate() + 7);
              setCurrentWeekStart(d);
            }}
            className="rounded-xl"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </header>

      <section className="relative min-h-[500px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-white/60 backdrop-blur-sm rounded-3xl">
            <Loader2 className="animate-spin text-primary mb-2" size={44} />
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Sincronizando Agenda...
            </p>
          </div>
        ) : !selectedCourtId ? (
          <div className="h-[600px] border-2 border-dashed border-outline-variant/40 rounded-3xl flex flex-col items-center justify-center text-center p-10 bg-slate-50/50">
            <div className="bg-primary/10 p-5 rounded-full mb-4">
              <CalendarDays size={48} className="text-primary/40" />
            </div>
            <h3 className="text-xl font-black uppercase text-slate-800">
              Vista de Reservas
            </h3>
            <p className="text-muted-foreground max-w-xs mt-2 font-medium">
              Selecciona un local y luego una cancha específica para gestionar
              las reservas.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <BookingsCalendar
              bookings={filteredBookings}
              weekStart={currentWeekStart}
            />
          </div>
        )}
      </section>
    </main>
  );
}

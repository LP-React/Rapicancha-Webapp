"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_NAMES = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

interface DayAvailability {
  weekday: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Step2Props {
  days: DayAvailability[];
  setDays: React.Dispatch<React.SetStateAction<DayAvailability[]>>;
  repeatAll: boolean;
  setRepeatAll: (val: boolean) => void;
}

export function Step2Availability({
  days,
  setDays,
  repeatAll,
  setRepeatAll,
}: Step2Props) {
  const updateDay = (index: number, updates: Partial<DayAvailability>) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], ...updates };

    if (repeatAll && index === 0) {
      setDays(
        newDays.map((d, i) =>
          i === 0 ? newDays[0] : { ...newDays[0], weekday: i },
        ),
      );
    } else {
      setDays(newDays);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-primary tracking-widest">
          ¿Usar el mismo horario para toda la semana?
        </span>
        <input
          type="checkbox"
          checked={repeatAll}
          onChange={(e) => setRepeatAll(e.target.checked)}
          className="w-5 h-5 accent-primary cursor-pointer"
        />
      </div>

      <div className="space-y-3">
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-6 p-4 rounded-2xl border transition-all",
              day.isActive
                ? "border-primary/30 bg-white shadow-sm"
                : "bg-gray-50 opacity-50 border-gray-100",
            )}
          >
            <div className="w-24 font-black text-[11px] uppercase tracking-tighter text-gray-600">
              {DAYS_NAMES[i]}
            </div>

            <input
              type="checkbox"
              checked={day.isActive}
              onChange={(e) => updateDay(i, { isActive: e.target.checked })}
              className="w-5 h-5 accent-primary cursor-pointer"
            />

            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg gap-2">
                <Clock size={14} className="text-gray-400" />
                <input
                  type="time"
                  value={day.startTime}
                  disabled={!day.isActive}
                  onChange={(e) => updateDay(i, { startTime: e.target.value })}
                  className="bg-transparent text-sm font-bold outline-none disabled:cursor-not-allowed"
                />
              </div>
              <span className="text-gray-300 font-bold text-xs uppercase">
                a
              </span>
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg gap-2">
                <Clock size={14} className="text-gray-400" />
                <input
                  type="time"
                  value={day.endTime}
                  disabled={!day.isActive}
                  onChange={(e) => updateDay(i, { endTime: e.target.value })}
                  className="bg-transparent text-sm font-bold outline-none disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

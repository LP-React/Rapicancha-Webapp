import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePosition } from "@/lib/calendar-utils";

interface BookingCardProps {
  booking: any;
}

export function BookingCard({ booking }: BookingCardProps) {
  const { top, height } = calculatePosition(booking.startTime, booking.endTime);
  const dayDate = new Date(booking.date + "T00:00:00");
  const dayIndex = dayDate.getDay() === 0 ? 6 : dayDate.getDay() - 1;
  const leftPosition = dayIndex * (100 / 7);

  return (
    <div
      className="absolute p-1 transition-all group"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: `${leftPosition}%`,
        width: `${100 / 7}%`,
      }}
    >
      <div
        className={cn(
          "h-full w-full rounded-xl border-l-4 p-3 shadow-md flex flex-col justify-between transition-all group-hover:scale-[1.03]",
          booking.status === "CONFIRMED"
            ? "bg-white border-primary ring-1 ring-primary/10"
            : "bg-white border-secondary",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black text-primary uppercase truncate">
              {booking.courtName}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
          <p className="text-[11px] font-black text-on-surface mt-1 leading-tight line-clamp-2">
            {booking.customerName}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-[10px] font-bold text-on-surface-variant">
            {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
          </span>
          <Info size={12} className="text-outline/40" />
        </div>
      </div>
    </div>
  );
}

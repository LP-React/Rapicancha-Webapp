"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/hooks/useAuth";
import { BookingService } from "@/services/booking-service";
import { BookingResponse } from "@/types/api/bookings/booking";
import { BottomNav } from "@/components/ui/botton-nav";
import { deleteCookie } from "cookies-next";
import { ChevronLeft, MapPin, CalendarDays, Clock, CheckCircle, XCircle, Clock4, LogOut } from "lucide-react";

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await BookingService.getByCustomer(user.accountId);
        // Sort descending by date/time (most recent first)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`);
          const dateB = new Date(`${b.date}T${b.startTime}`);
          return dateB.getTime() - dateA.getTime();
        });
        setBookings(sorted);
      } catch (err: any) {
        setError(err.message || "Error al cargar las reservas.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4 text-[#abd600]" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "PENDING":
      default:
        return <Clock4 className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-[#abd600]/10 text-[#abd600] border-[#abd600]/30";
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "PENDING":
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "Validada";
      case "CANCELLED": return "Cancelada";
      case "PENDING": return "Pendiente de ingreso";
      default: return status;
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return time.substring(0, 5); // "HH:MM"
  };

  return (
    <div className="bg-[#111508] text-[#e2e4cf] min-h-screen pb-24 selection:bg-[#c3f400] selection:text-[#161e00]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 flex justify-between items-center w-full px-5 h-16">
        <button
          onClick={() => router.push("/")}
          className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-white">Mis Reservas</h1>
        <button
          onClick={() => {
            deleteCookie("auth_user");
            window.location.href = "/login";
          }}
          className="p-2 -mr-2 rounded-full active:bg-white/10 transition-colors text-red-500/80 hover:text-red-500"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="p-5 max-w-md mx-auto">
        {loading || authLoading ? (
          <div className="flex flex-col space-y-4 animate-pulse mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl w-full"></div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#abd600] text-[#111508] font-semibold rounded-full text-sm"
            >
              Reintentar
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <CalendarDays className="w-10 h-10 text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Aún no tienes reservas</h2>
            <p className="text-[#a1a68d] mb-8 text-sm">
              Explora las canchas disponibles y asegura tu próximo partido.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#abd600] text-[#111508] font-bold rounded-full w-full active:scale-[0.98] transition-transform"
            >
              Explorar canchas
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.idBooking}
                className="relative overflow-hidden bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-5 hover:border-[#abd600]/30 transition-colors group"
              >
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#c3f400] to-transparent opacity-50"></div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Cancha {booking.courtName || booking.idSportCourt}
                    </h3>
                    <div className="flex items-center text-[#a1a68d] text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      Rapicancha Center
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusIcon(booking.status)}
                    {getStatusLabel(booking.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-black/20 rounded-xl mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#abd600]" />
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">Fecha</p>
                      <p className="text-sm font-medium text-zinc-200">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#abd600]" />
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">Horario</p>
                      <p className="text-sm font-medium text-zinc-200">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Total pagado</p>
                    <p className="text-xl font-black text-white">
                      S/ {booking.price.toFixed(2)}
                    </p>
                  </div>
                  
                  {booking.status === "PENDING" && (
                    <button 
                      onClick={() => setSelectedQrCode(booking.qrCode)}
                      className="text-xs font-semibold text-[#111508] bg-[#abd600] px-4 py-2 rounded-full active:scale-95 transition-transform"
                    >
                      Ver QR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {selectedQrCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161e00] border border-[#abd600]/30 p-6 rounded-3xl w-full max-w-sm flex flex-col items-center shadow-2xl relative">
            <button 
              onClick={() => setSelectedQrCode(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Tu Código QR</h3>
            <p className="text-sm text-[#a1a68d] text-center mb-6">
              Muestra este código en la recepción para confirmar tu ingreso a la cancha.
            </p>
            <div className="bg-white p-4 rounded-2xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedQrCode}`} 
                alt="Booking QR Code" 
                className="w-48 h-48"
              />
            </div>
            <p className="mt-6 text-[10px] font-mono text-zinc-500 bg-black/30 px-3 py-1.5 rounded-lg break-all text-center">
              {selectedQrCode}
            </p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

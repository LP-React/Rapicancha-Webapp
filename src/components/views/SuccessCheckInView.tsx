"use client";

import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CheckInResponse } from "@/types/api/bookings/booking";

export function SuccessCheckInView({ data }: { data: CheckInResponse }) {
  return (
    <div className="relative min-h-screen bg-[#fcfdf7] text-[#191c1a] antialiased overflow-hidden flex flex-col font-sans">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#d1e8dd]/30 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[30%] rounded-full bg-[#f0efd5]/40 blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 md:p-10 text-center shadow-[0_32px_64px_-16px_rgba(45,74,65,0.12)] border border-white">
            {/* Success Icon */}
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d1e8da] text-[#2d4a41]">
              <CheckCircle
                size={40}
                fill="currentColor"
                className="text-[#d1e8da] fill-[#2d4a41]"
              />
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-[#2d4a41]">
                Check-in Exitoso
              </h1>
              <p className="text-[#414942] font-medium">
                Tu entrada ha sido registrada correctamente.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#f1f4ec] rounded-xl p-6 mb-8 text-left space-y-4 border border-[#c1c9bf]/30">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#717972] mb-1">
                  Cancha
                </span>
                <span className="text-lg font-bold text-[#191c1a]">
                  {data.courtName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#717972] mb-1">
                    Cliente
                  </span>
                  <span className="text-sm font-semibold text-[#191c1a]">
                    {data.customerName}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#717972] mb-1">
                    Fecha
                  </span>
                  <span className="text-sm font-semibold text-[#191c1a]">
                    {data.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#717972] mb-1">
                  Horario
                </span>
                <span className="text-sm font-semibold text-[#191c1a]">
                  {data.startTime} - {data.endTime}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="w-full py-4 px-6 bg-[#2d4a41] text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#2d4a41]/20 flex items-center justify-center gap-2"
              >
                Volver al Dashboard
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Metadata Footer */}
            <div className="mt-8 pt-6 border-t border-[#c1c9bf]/20">
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-[#717972] px-2">
                <span>Reserva: #{data.idBooking}</span>
                <span>Ref: {data.qrCode.split("-")[0]}</span>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-6 flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-[#414942]/60">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Acceso verificado
              </span>
            </div>
            <button className="text-[10px] font-bold uppercase tracking-wider text-[#2d4a41] hover:underline">
              ¿Necesitas ayuda?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

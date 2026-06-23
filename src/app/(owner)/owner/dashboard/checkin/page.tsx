"use client";

import { useState } from "react";
import { BookingService } from "@/services/booking-service";
import { useAuth } from "@/components/hooks/useAuth";
import { Scan, CheckCircle2, XCircle, Search } from "lucide-react";

export default function CheckinPage() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    data?: any;
    message?: string;
    alreadyValidated?: boolean;
  } | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode.trim() || !user?.accountId) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await BookingService.checkIn(qrCode.trim(), user.accountId);
      setResult({
        success: true,
        data: response,
      });
      setQrCode(""); // clear after success
    } catch (error: any) {
      const message = error.message || "El código QR es inválido o la reserva no existe.";
      const alreadyValidated = message.toLowerCase().includes("validada") || message.toLowerCase().includes("ya fue");
      setResult({
        success: false,
        alreadyValidated,
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Escanear QR</h1>
          <p className="text-on-surface-variant">
            Valida el ingreso de tus clientes pegando o escribiendo el código único (UUID) de su reserva.
          </p>
        </div>

        <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          {/* Animated scanning background line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#abd600] opacity-50 shadow-[0_0_20px_#abd600] animate-[pulse_2s_ease-in-out_infinite]" />

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-24 h-24 bg-[#abd600]/10 rounded-full flex items-center justify-center border border-[#abd600]/20 mb-4">
              <Scan className="w-10 h-10 text-[#abd600]" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Visor de Ingreso</h2>
          </div>

          <form onSubmit={handleScan} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Ingresa el UUID de la reserva..."
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full bg-background border border-outline-variant/50 text-on-surface rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#abd600]/50 focus:border-[#abd600] transition-all"
                required
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            </div>

            <button
              type="submit"
              disabled={loading || !qrCode.trim()}
              className="w-full py-4 bg-[#abd600] hover:bg-[#c3f400] text-[#161e00] font-bold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#161e00]/30 border-t-[#161e00] rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                "Validar Ingreso"
              )}
            </button>
          </form>

          {/* Results Area */}
          {result && (
            <div className={`mt-8 p-6 rounded-2xl border animate-in slide-in-from-bottom-4 duration-300 ${
              result.success 
                ? "bg-green-500/10 border-green-500/20"
                : result.alreadyValidated
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : "bg-red-500/10 border-red-500/20"
            }`}>
              {result.success ? (
                <div className="flex flex-col items-center text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">¡Ingreso Autorizado!</h3>
                  <p className="text-green-400 font-medium mb-4">La reserva ha sido verificada con éxito.</p>
                  
                  <div className="w-full bg-black/20 rounded-xl p-4 text-left space-y-2 border border-white/5">
                    <p className="text-sm text-zinc-400">Cliente: <span className="font-semibold text-white">{result.data.customerName}</span></p>
                    <p className="text-sm text-zinc-400">Cancha: <span className="font-semibold text-white">{result.data.courtName}</span></p>
                    <p className="text-sm text-zinc-400">Fecha: <span className="font-semibold text-white">{result.data.date}</span></p>
                    <p className="text-sm text-zinc-400">Horario: <span className="font-semibold text-white">{result.data.startTime} - {result.data.endTime}</span></p>
                    <p className="text-sm text-zinc-400">Monto: <span className="font-bold text-[#abd600]">S/ {result.data.price?.toFixed(2) || '0.00'}</span></p>
                  </div>
                </div>
              ) : result.alreadyValidated ? (
                <div className="flex flex-col items-center text-center">
                  <CheckCircle2 className="w-12 h-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ya fue validada</h3>
                  <p className="text-yellow-400">Esta reserva ya fue confirmada previamente. El cliente ya tiene su ingreso registrado.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <XCircle className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ingreso Denegado</h3>
                  <p className="text-red-400">{result.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

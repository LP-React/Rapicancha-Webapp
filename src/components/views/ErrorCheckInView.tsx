"use client";
import { AlertCircle } from "lucide-react";

export function ErrorCheckInView({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdf7] p-6">
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-xl border border-red-50 text-center max-w-sm w-full font-sans">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error de Check-in
        </h2>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );
}

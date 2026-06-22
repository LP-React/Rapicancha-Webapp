"use client";
import { ChevronLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function VenueHeader() {
  const router = useRouter();

  return (
    <header className="bg-[#111508] border-b border-[#333627] h-14 flex justify-between items-center w-full px-4 sticky top-0 z-[60]">
      <button onClick={() => router.back()} className="p-2">
        <ChevronLeft className="text-[#abd600] w-6 h-6" />
      </button>
      <h1 className="font-semibold text-base tracking-tight text-[#e2e4cf]">
        Venue Details
      </h1>
      <button className="p-2">
        <Share2 className="text-[#abd600] w-5 h-5" />
      </button>
    </header>
  );
}

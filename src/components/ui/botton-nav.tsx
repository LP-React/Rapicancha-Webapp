import { Compass, Calendar, Heart, User } from "lucide-react";
import Link from "next/link";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 border-t border-[#333627] bg-[#111508] flex justify-around items-center h-16 pb-2 px-6">
      <Link
        href="#"
        className="flex flex-col items-center justify-center text-[#abd600]"
      >
        <Compass className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-0.5">Explore</span>
      </Link>
      <Link
        href="/bookings"
        className="flex flex-col items-center justify-center text-[#a1a68d]"
      >
        <Calendar className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-0.5">Bookings</span>
      </Link>
      <Link
        href="#"
        className="flex flex-col items-center justify-center text-[#a1a68d]"
      >
        <Heart className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-0.5">Favorites</span>
      </Link>
      <Link
        href="#"
        className="flex flex-col items-center justify-center text-[#a1a68d]"
      >
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-0.5">Profile</span>
      </Link>
    </nav>
  );
}

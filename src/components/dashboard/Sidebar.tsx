"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next"; // Importante para el logout
import {
  Hexagon,
  MapPin,
  Trophy,
  CalendarDays,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Resumen", href: "/dashboard", icon: Home },
  { label: "Locales", href: "/dashboard/locales", icon: MapPin },
  { label: "Canchas", href: "/dashboard/canchas", icon: Trophy },
  { label: "Reservas", href: "/dashboard/reservas", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = () => {
    deleteCookie("auth_user");
    router.push("/login");
    router.refresh();
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <aside className="hidden lg:flex h-screen w-72 border-r border-outline-variant/20 bg-surface flex-col p-6 sticky top-0">
      <div className="flex items-center space-x-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl custom-gradient flex items-center justify-center text-white shadow-md">
          <Hexagon className="fill-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-on-surface">
            RapiCancha
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-70">
            Panel administrativo
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-12 px-4 transition-all duration-200",
                    isActive
                      ? "bg-white shadow-sm text-on-surface font-semibold border border-outline-variant/10"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                  )}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-primary" : "text-outline"}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto pt-6 border-t border-outline-variant/10">
        <div className="flex items-center justify-between group">
          <div className="flex items-center space-x-3 px-2 min-w-0">
            <Avatar className="h-10 w-10 border border-outline-variant/20 shadow-sm">
              <AvatarFallback className="bg-primary-container text-on-primary-container font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface truncate">
                {loading ? "Cargando..." : user?.email || "Usuario"}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter">
                {user?.role === "OWNER"
                  ? "Administrador"
                  : user?.role || "Personal"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-outline hover:text-error hover:bg-error/10 shrink-0"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </aside>
  );
}

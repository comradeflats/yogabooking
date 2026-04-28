"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Users, Palette, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/booking-portal", icon: LayoutDashboard },
  { name: "Bookings", href: "/booking-portal/bookings", icon: Users },
  { name: "Time Slots", href: "/booking-portal/time-slots", icon: Calendar },
  { name: "Class Types", href: "/booking-portal/class-types", icon: Palette },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/booking-portal/logout", { method: "POST" });
    window.location.href = "/booking-portal/login";
  };

  return (
    <div className="flex flex-col w-64 bg-zinc-900 text-white">
      <div className="flex items-center justify-center h-16 border-b border-zinc-800">
        <h1 className="text-xl font-bold">Yoga Admin</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/booking-portal" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}

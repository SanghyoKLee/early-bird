// src/app/dashboard/DashboardSidebar.tsx

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgePercent, AlarmClock, QrCode, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Streak", icon: BadgePercent, href: "/dashboard/streak" },
  {
    label: "Set Wake Time",
    icon: AlarmClock,
    href: "/dashboard/set-wake-time",
  },
  { label: "QR", icon: QrCode, href: "/dashboard/qr" },
  { label: "Account", icon: UserCircle, href: "/dashboard/account" },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="h-full bg-surface border-r border-muted flex flex-col p-4 min-w-[220px]">
      <div className="mb-8 flex items-center gap-2">
        <span className="text-2xl font-extrabold text-primary">🐦</span>
        <span className="font-bold text-xl tracking-tight text-primary">
          Early Bird
        </span>
      </div>
      <nav className="flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-text-light hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

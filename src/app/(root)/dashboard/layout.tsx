// src/app/dashboard/layout.tsx
"use client";
import { DashboardSidebar } from "./DashboardSidebar";
import "@/app/globals.css";
import { Providers } from "../providers";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Providers>
      {/* MOBILE TOPBAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-muted fixed top-0 left-0 right-0 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="p-2 rounded-md bg-primary text-primary-foreground"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[220px]">
            <DashboardSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-xl font-bold text-primary ml-2">
          🐦 Early Bird
        </span>
        <div className="w-10" />
      </div>

      <div className="flex h-screen bg-background pt-[56px] md:pt-0">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-16 overflow-auto w-full">
          {children}
        </main>
      </div>
    </Providers>
  );
}

// src/app/(root)/layout.tsx

import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/app/(root)/(main)/Navbar";
import { Footer } from "@/app/(root)/(main)/Footer";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Early Bird",
  description: "Wake up early, get more done.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center px-4 pt-12">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  );
}

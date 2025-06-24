"use client";

// src/components/Navbar.tsx

import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { status } = useSession();

  return (
    <nav className="w-full py-4 bg-surface shadow-sm flex items-center justify-between px-6">
      <Link href="/" className="text-xl font-bold text-primary tracking-tight">
        🐦 Early Bird
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-text-light hover:text-primary font-medium"
        >
          Dashboard
        </Link>
        {status !== "authenticated" && (
          <Button className="bg-primary font-semibold hover:bg-primary-hover transition duration-100 hover:cursor-pointer">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

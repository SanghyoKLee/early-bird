"use client";

// src/components/Navbar.tsx

import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { status } = useSession();
  const router = useRouter();

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (status === "authenticated") {
      router.push("/dashboard/streak");
    } else {
      router.push("/auth/signin");
    }
  };
  return (
    <nav className="w-full py-4 bg-surface shadow-sm flex items-center justify-between px-6">
      <Link href="/" className="text-xl font-bold text-primary tracking-tight">
        Early Bird
      </Link>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="text-secondary-dark hover:text-secondary-foreground hover:bg-secondary/20 font-medium hover:cursor-pointer hover:"
          onClick={handleDashboardClick}
        >
          Dashboard
        </Button>
        {status !== "authenticated" && (
          <Button className="bg-primary font-semibold hover:bg-primary-hover transition duration-100 hover:cursor-pointer">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

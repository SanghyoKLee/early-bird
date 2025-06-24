"use client";
import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { UserCircle2, LogOut, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, duration: 0.8 },
  },
};

type User = {
  id: string;
  username?: string;
  email: string;
  created_at: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user info from your API
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user info.");
        setLoading(false);
      });
  }, []);

  // Sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Delete all user data (but not the account itself)
  const handleDeleteData = () => {
    if (
      !confirm(
        "Delete all your data (except your account)? This cannot be undone."
      )
    )
      return;
    setError(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/account/delete-data", { method: "POST" });
        if (!res.ok) throw new Error();
        setSuccessMsg("Your data has been deleted.");
      } catch {
        setError("Failed to delete data.");
      }
    });
  };

  // Delete account (and all data)
  const handleDeleteAccount = () => {
    if (!confirm("Delete your account permanently? This cannot be undone!"))
      return;
    setError(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/account/delete-account", {
          method: "POST",
        });
        if (!res.ok) throw new Error();
        setSuccessMsg("Account deleted.");
        setTimeout(() => signOut({ callbackUrl: "/" }), 2000);
      } catch {
        setError("Failed to delete account.");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-10 ">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg mx-auto rounded-2xl bg-surface border border-muted shadow-xl p-10 flex flex-col gap-6 "
      >
        <div className="flex flex-col items-center gap-2">
          <UserCircle2 className="w-16 h-16 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Account</h1>
          <p className="text-sm text-text-light text-center">
            Manage your Early Bird profile and data
          </p>
        </div>
        {loading ? (
          <div className="animate-pulse w-full h-10 bg-muted rounded-lg" />
        ) : user ? (
          <>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">{user.email}</span>
              </div>
              {user.username && (
                <div className="flex items-center gap-2">
                  <span className="text-base">{user.username}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-base">
                  Joined{" "}
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <Button
                onClick={handleSignOut}
                variant="default"
                className="flex items-center gap-2 w-full hover:cursor-pointer"
                size="lg"
              >
                <LogOut className="w-5 h-5" /> Sign out
              </Button>
              <Button
                onClick={handleDeleteData}
                variant="outline"
                className="flex items-center gap-2 w-full text-accent hover:cursor-pointer"
                disabled={actionLoading}
                size="lg"
              >
                <Trash2 className="w-5 h-5" /> Delete my data
              </Button>
              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="flex items-center gap-2 w-full font-bold text-red-400 hover:cursor-pointer hover:bg-red-400"
                disabled={actionLoading}
                size="lg"
              >
                <ShieldAlert className="w-5 h-5" /> Delete account
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-red-500">User not found</div>
        )}
        {(error || successMsg) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 px-4 py-2 rounded-lg text-center text-sm ${
              error
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {error || successMsg}
          </motion.div>
        )}
        {/* You could add more here: password reset, link to support, etc. */}
      </motion.div>
    </div>
  );
}

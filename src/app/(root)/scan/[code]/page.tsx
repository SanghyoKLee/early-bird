// src/app/scan/[code]/page.tsx

"use client";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ScanPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params); // <--- unwrap the promise
  const { data: session } = useSession();
  const [step, setStep] = useState<
    "form" | "success" | "almost" | "late" | "invalid"
  >("form");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [minutesLate, setMinutesLate] = useState<number>(0);

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email);
  }, [session?.user?.email]);

  useEffect(() => {
    if (step === "success") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // ---- NEW: Get local device time (ISO string, no timezone offset) ----
    const localDate = new Date();
    const localDateTime = `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1
    ).padStart(2, "0")}-${String(localDate.getDate()).padStart(
      2,
      "0"
    )}T${String(localDate.getHours()).padStart(2, "0")}:${String(
      localDate.getMinutes()
    ).padStart(2, "0")}:${String(localDate.getSeconds()).padStart(2, "0")}`;

    const res = await fetch("/api/scan", {
      method: "POST",
      body: JSON.stringify({
        code,
        email,
        password,
        localDateTime, // <--- Send the local time as string
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMinutesLate(data.minutesLate || 0);

    if (!res.ok) {
      setMessage(data.error || "Invalid email or password");
      setLoading(false);
      return;
    }

    if (data.status === "success") {
      setStep("success");
      setShowConfetti(true);
    } else if (data.status === "almost") {
      setStep("almost");
    } else if (data.status === "late") {
      setStep("late");
    } else {
      setStep("invalid");
      setMessage(data.error || "Scan failed");
    }
    setLoading(false);
  };

  // Animations
  const spring = {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <AnimatePresence mode="wait" initial={false}>
        {step === "form" && (
          <motion.form
            key="form"
            initial={{ scale: 0.98, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={spring}
            onSubmit={handleSubmit}
            className="bg-surface p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-5 border border-muted"
          >
            <h2 className="text-xl font-bold text-primary text-center mb-2">
              Verify Your Early Bird Identity
            </h2>
            <div className="text-center text-text-light mb-2">
              Please enter your {session ? "password" : "email and password"} to
              confirm your scan.
            </div>
            {!session && (
              <input
                type="email"
                className="w-full rounded-md border border-muted p-3 mb-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            )}
            <input
              type="password"
              className="w-full rounded-md border border-muted p-3 mb-1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {message && (
              <div className="text-red-500 text-sm text-center">{message}</div>
            )}
            <button
              className="w-full bg-primary text-primary-foreground rounded-md py-2 font-bold text-lg mt-2 hover:bg-primary-hover transition"
              type="submit"
              disabled={loading || !password || (!session && !email)}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-primary-foreground"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Confirm Scan"
              )}
            </button>
          </motion.form>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={spring}
            className="flex flex-col items-center gap-4 bg-surface rounded-2xl shadow-xl px-8 py-12 border border-muted"
          >
            <CheckCircle2 className="w-16 h-16 text-accent mb-2" />
            <h2 className="text-3xl font-bold text-primary mb-2">
              You made it 🎉
            </h2>
            <p className="text-text text-center text-lg mb-1">
              You got here on time! <br /> Keep up the streak!
            </p>
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  key="confetti"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="fixed inset-0 pointer-events-none z-[200]"
                >
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Link
              href="/dashboard/streak"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:bg-primary-hover transition"
            >
              Dashboard
            </Link>
          </motion.div>
        )}

        {step === "almost" && (
          <motion.div
            key="almost"
            initial={{ scale: 0.98, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -30 }}
            transition={spring}
            className="flex flex-col items-center gap-4 bg-surface rounded-2xl shadow-xl px-8 py-12 border border-muted"
          >
            <CheckCircle2 className="w-16 h-16 text-accent mb-2" />
            <h2 className="text-2xl font-bold text-accent mb-2">Almost!</h2>
            <p className="text-text text-center text-lg mb-1">
              Only {minutesLate} minute{minutesLate !== 1 ? "s" : ""} late.
              Great job getting here.
              <br />
              Consistency beats perfection!
            </p>
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  key="confetti"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="fixed inset-0 pointer-events-none z-[200]"
                >
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Link
              href="/dashboard/streak"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:bg-primary-hover transition"
            >
              Dashboard
            </Link>
          </motion.div>
        )}

        {step === "late" && (
          <motion.div
            key="late"
            initial={{ scale: 0.98, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -30 }}
            transition={spring}
            className="flex flex-col items-center gap-4 bg-surface rounded-2xl shadow-xl px-8 py-12 border border-muted"
          >
            <CheckCircle2 className="w-16 h-16 text-accent mb-2" />
            <h2 className="text-2xl font-bold text-accent mb-2">Late</h2>
            <p className="text-text text-center text-lg mb-1">
              You missed your wake time, but showing up still counts!
            </p>
            <p className="text-text-light text-center">
              You logged your scan today and that&apos;s what matters. <br />
              Tomorrow&apos;s a fresh start!
            </p>
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  key="confetti"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="fixed inset-0 pointer-events-none z-[200]"
                >
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Link
              href="/dashboard/streak"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:bg-primary-hover transition"
            >
              Dashboard
            </Link>
          </motion.div>
        )}

        {step === "invalid" && (
          <motion.div
            key="invalid"
            initial={{ scale: 0.98, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -30 }}
            transition={spring}
            className="flex flex-col items-center gap-4 bg-surface rounded-2xl shadow-xl px-8 py-12 border border-muted"
          >
            <h2 className="text-2xl font-bold text-destructive mb-2">
              Invalid
            </h2>
            <p className="text-text text-center text-lg mb-1">
              That scan is invalid. Please try again!
            </p>
            <button
              className="mt-3 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:bg-primary-hover"
              onClick={() => setStep("form")}
            >
              Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

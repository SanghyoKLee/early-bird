"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TimePicker } from "./TimePicker";

function formatTime24to12(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":");
  let hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m.padStart(2, "0")} ${period}`;
}

export default function SetWakeTimePage() {
  const [wakeTime, setWakeTime] = useState<string>("");
  const [savedWakeTime, setSavedWakeTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/wake-time")
      .then((res) => res.json())
      .then((data) => {
        if (data.wakeTime) {
          setWakeTime(data.wakeTime);
          setSavedWakeTime(data.wakeTime);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (newTime: string) => {
    setLoading(true);
    const res = await fetch("/api/wake-time", {
      method: "POST",
      body: JSON.stringify({ wakeTime: newTime }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setSavedWakeTime(data.wakeTime);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1800);
    setLoading(false);
    setWakeTime(data.wakeTime);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
        <div className="mt-4 text-text-light">Loading your wake time...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-2xl shadow-xl p-8 flex flex-col items-center border border-muted relative lg:min-w-1/4"
      >
        <h2 className="font-bold mb-2 text-primary lg:text-2xl text-xl">
          Set Your Wake Time
        </h2>
        <div className="text-black mb-6 text-lg">
          Current:{" "}
          <span className="font-semibold text-primary">
            {savedWakeTime ? formatTime24to12(savedWakeTime) : "Not set"}
          </span>
        </div>
        <TimePicker
          value={wakeTime}
          onChange={setWakeTime}
          onSave={handleSave}
        />
      </motion.div>
      <div className="text-lg mt-12 max-w-140 text-text-light lg:p-0 px-4 text-center">
        <ul>
          <li className="mb-4">
            This time will be used as your target wake-up time every morning.
          </li>
          <li className="mb-4">
            If you scan your QR code before this time, it counts as a success!
          </li>
          <li className="mb-4">
            You&apos;ll have a few minutes after your wake time to scan your
            code, so it&apos;s recommended that you set this as the same time as
            your alarm.{" "}
          </li>
        </ul>
      </div>
      {/* --- FLOATING TOAST --- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-success/90 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg z-[100]"
          >
            <CheckCircle2 className="w-6 h-6 text-accent" />
            <span className="font-semibold text-lg text-accent">Saved!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

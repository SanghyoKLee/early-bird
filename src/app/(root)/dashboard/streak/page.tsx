"use client";
import { useEffect, useState } from "react";
import {
  format,
  startOfYear,
  endOfYear,
  addDays,
  differenceInCalendarDays,
  getDay,
  isAfter,
  isBefore,
  isToday,
} from "date-fns";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

// Utility
function getDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

// Calculate current streak (consecutive days up to today, ending at today or yesterday if missed)
function calcStreak(days: { date: Date; success: boolean }[]) {
  let streak = 0;
  for (let i = 0; i < days.length; i++) {
    const idx = days.length - 1 - i;
    const d = days[idx];
    // If it's today or before today:
    if (isAfter(d.date, new Date())) continue;
    if (d.success) streak++;
    else break;
  }
  return streak;
}

export default function StreakPage() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<{ date: Date; success: boolean }[]>([]);
  const [streak, setStreak] = useState(0);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/scans")
      .then((res) => res.json())
      .then(({ scans, created_at }) => {
        const scanMap = new Map<string, boolean>();
        for (const scan of scans) {
          const dateKey = getDateKey(new Date(scan.scanned_at));
          // Only count as success if any scan was successful for that day
          if (!scanMap.has(dateKey) && scan.success) {
            scanMap.set(dateKey, true);
          } else if (!scanMap.has(dateKey)) {
            scanMap.set(dateKey, false);
          }
        }
        setCreatedAt(created_at ? new Date(created_at) : null);
        // Generate all days in the year
        const year = new Date().getFullYear();
        const start = startOfYear(new Date(year, 0, 1));
        const end = endOfYear(new Date(year, 0, 1));
        const numDays = differenceInCalendarDays(end, start) + 1;
        const allDays: { date: Date; success: boolean }[] = [];
        for (let i = 0; i < numDays; i++) {
          const d = addDays(start, i);
          allDays.push({ date: d, success: !!scanMap.get(getDateKey(d)) });
        }
        setDays(allDays);
        setStreak(calcStreak(allDays));
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-background">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary mb-3 flex items-center gap-3">
          <Flame className="text-orange-500 w-7 h-7" />
          Streak: <span className="ml-2 text-4xl">{streak}</span>
        </h1>
        <div className="text-base text-text-light mb-8 text-center">
          Consecutive days you&apos;ve scanned on time in{" "}
          {new Date().getFullYear()}.
        </div>
        {loading ? (
          <div className="animate-pulse h-8 w-full bg-muted rounded-lg my-12" />
        ) : (
          <StreakGrid days={days} />
        )}
        <div className="mt-8 max-w-xl text-text text-center">
          <span className="font-semibold text-green-600">Green</span>: scanned
          on time. <span className="font-semibold text-red-500">Red</span>:
          missed scan.{" "}
          <span className="font-semibold text-muted-foreground">Gray</span>:
          future day.
        </div>
      </div>
    </div>
  );

  function StreakGrid({ days }: { days: { date: Date; success: boolean }[] }) {
    const startDate = days[0]?.date ?? new Date();
    const janFirstWeekday = getDay(startDate); // 0=Sun
    const paddedDays: ({ date: Date; success: boolean } | null)[] = Array(
      janFirstWeekday
    )
      .fill(null)
      .concat(days);

    // Pad to 53 weeks (max weeks in year)
    const totalCells = 53 * 7;
    while (paddedDays.length < totalCells) paddedDays.push(null);

    // Split into week columns
    const weeks: ({ date: Date; success: boolean } | null)[][] = [];
    for (let i = 0; i < 53; i++) {
      weeks.push(paddedDays.slice(i * 7, (i + 1) * 7));
    }

    // Find which week columns contain a first-of-month day
    const monthLabels: string[] = Array(53).fill("");
    for (let i = 0; i < weeks.length; i++) {
      for (let d = 0; d < 7; d++) {
        const cell = weeks[i][d];
        if (cell && cell.date.getDate() === 1) {
          monthLabels[i] = format(cell.date, "MMM");
          break;
        }
      }
    }

    return (
      <div className="flex flex-col">
        {/* Month labels */}
        <div className="flex flex-row ml-6 mb-1">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className="w-6 text-xs text-muted-foreground font-bold text-center"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-row">
          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col">
              {week.map((cell, di) => {
                if (!cell)
                  return (
                    <div key={di} className="w-6 h-6 m-[1.5px] opacity-0" />
                  );
                const isFuture = isAfter(cell.date, endOfYear(new Date()));
                //   const isTodayOrPast =
                //     !isFuture && !isBefore(cell.date, startOfYear(new Date()));

                // NEW: Before account creation? Render as dim/inactive
                const beforeCreated =
                  createdAt && isBefore(cell.date, createdAt);

                let color = "";
                if (beforeCreated) {
                  color = "bg-muted border-muted-foreground/30 opacity-40";
                } else if (isFuture) {
                  color = "bg-muted-foreground/20 border-muted";
                } else if (cell.success) {
                  color = "bg-green-500 border-green-600";
                } else if (
                  isToday(cell.date) ||
                  isBefore(cell.date, new Date())
                ) {
                  color = "bg-red-400 border-red-500";
                } else {
                  color = "bg-muted-foreground/20 border-muted";
                }
                return (
                  <motion.div
                    key={di}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.008 * (wi * 7 + di) }}
                    className={`
                    w-6 h-6 m-[1.5px] rounded-md border
                    ${color}
                    cursor-pointer
                  `}
                    title={`${format(cell.date, "EEE, MMM d yyyy")} - ${
                      beforeCreated
                        ? "Before signup"
                        : isFuture
                        ? "Future"
                        : cell.success
                        ? "Success"
                        : "Missed"
                    }`}
                  ></motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

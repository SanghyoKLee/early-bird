// src/app/api/scan/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users, qrcodes, userSettings, scans } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { code, email, password } = await req.json();

  // 1. Find QR code entry
  const qrRows = await db.select().from(qrcodes).where(eq(qrcodes.code, code));
  if (qrRows.length === 0) {
    return NextResponse.json({ error: "Invalid QR code" }, { status: 400 });
  }
  const qr = qrRows[0];

  // 2. Find user
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, qr.user_id));
  if (userRows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }
  const user = userRows[0];

  // 3. If email provided, check it matches
  if (email && user.email !== email) {
    return NextResponse.json({ error: "Incorrect email" }, { status: 400 });
  }

  // 4. Validate password
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
  }

  // 5. Get scheduled wake time (user_settings)
  const settingsRows = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.user_id, user.id));
  if (settingsRows.length === 0 || !settingsRows[0].target_wake_time) {
    return NextResponse.json({ error: "No wake time set" }, { status: 400 });
  }
  const scheduledWakeTime = settingsRows[0].target_wake_time; // "07:00" string

  // 6. Check if scan is on time
  const now = new Date();
  const [wakeHour, wakeMinute] = scheduledWakeTime.split(":").map(Number);
  const targetDate = new Date(now);
  targetDate.setHours(wakeHour, wakeMinute, 0, 0);

  const msLate = now.getTime() - targetDate.getTime();
  const minutesLate = msLate > 0 ? Math.floor(msLate / 60000) : 0;
  const scanStatus =
    minutesLate <= 3 ? "success" : minutesLate <= 30 ? "almost" : "late";

  // 7. Insert scan record (always, even if late)
  await db.insert(scans).values({
    user_id: user.id,
    qrcode_id: qr.id,
    scanned_at: now.toISOString(),
    scheduled_wake_time: scheduledWakeTime,
    success: scanStatus === "success",
  });

  return NextResponse.json({
    status: scanStatus,
    minutesLate,
  });
}

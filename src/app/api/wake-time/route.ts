// src/app/api/wake-time/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Get current wake time
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.user_id, session.user.id));

  const wakeTime = result[0]?.target_wake_time || null;
  return NextResponse.json({ wakeTime });
}

// Update wake time
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { wakeTime } = await request.json();

  // Update or insert
  await db
    .insert(userSettings)
    .values({
      user_id: session.user.id,
      target_wake_time: wakeTime,
    })
    .onConflictDoUpdate({
      target: userSettings.user_id,
      set: { target_wake_time: wakeTime },
    });

  return NextResponse.json({ wakeTime });
}

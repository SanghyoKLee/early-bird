import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db/db";
import { scans, qrcodes, userSettings, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/authOptions";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete scans
  await db.delete(scans).where(eq(scans.user_id, session.user.id));
  // Delete qrcodes
  await db.delete(qrcodes).where(eq(qrcodes.user_id, session.user.id));

  await db
    .delete(userSettings)
    .where(eq(userSettings.user_id, session.user.id));

  await db
    .update(users)
    .set({ scan_start_at: new Date().toISOString() })
    .where(eq(users.id, session.user.id));
  // Add any additional user-data deletions as needed

  return NextResponse.json({ success: true });
}

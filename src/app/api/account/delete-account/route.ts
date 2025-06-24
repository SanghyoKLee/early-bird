import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db/db";
import { users, scans, qrcodes, userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete scans, qrcodes, etc. (in correct order)
  await db.delete(scans).where(eq(scans.user_id, session.user.id));
  await db.delete(qrcodes).where(eq(qrcodes.user_id, session.user.id));
  await db
    .delete(userSettings)
    .where(eq(userSettings.user_id, session.user.id));
  await db.delete(users).where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}

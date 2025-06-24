import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { scans, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get all scans for the user, sort by date ASC
  const allScans = await db
    .select()
    .from(scans)
    .where(eq(scans.user_id, session.user.id));

  // Get user's created_at
  const userRows = await db
    .select({ created_at: users.created_at })
    .from(users)
    .where(eq(users.id, session.user.id));

  const created_at = userRows[0]?.created_at ?? null;

  return NextResponse.json({ scans: allScans, created_at });
}

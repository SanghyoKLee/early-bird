import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Fetch user from DB, selecting what you want to show
  const userRows = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.id, session.user.id));
  const user = userRows[0];

  return NextResponse.json({ user });
}

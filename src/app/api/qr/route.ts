import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { qrcodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

function formatQrUrl(code: string) {
  return `${baseUrl}/scan/${code}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Find QR code for user
  const found = await db
    .select()
    .from(qrcodes)
    .where(eq(qrcodes.user_id, session.user.id));

  if (found.length > 0) {
    return NextResponse.json({
      qr: {
        ...found[0],
        qrUrl: formatQrUrl(found[0].code),
      },
    });
  }
  return NextResponse.json({ qr: null });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if already exists (shouldn't be calling post)
  const found = await db
    .select()
    .from(qrcodes)
    .where(eq(qrcodes.user_id, session.user.id));
  if (found.length > 0) {
    return NextResponse.json({
      qr: {
        ...found[0],
        qrUrl: formatQrUrl(found[0].code),
      },
    });
  }

  // Generate a new QR code entry
  const code = uuidv4();
  const newQr = {
    user_id: session.user.id,
    code,
    created_at: new Date().toISOString(),
  };
  await db.insert(qrcodes).values(newQr);

  return NextResponse.json({
    qr: {
      ...newQr,
      qrUrl: formatQrUrl(code),
    },
  });
}

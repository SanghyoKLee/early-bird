// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { registerSchema } from "@/types/schema";
import { db } from "@/db/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsedData = registerSchema.safeParse(data);
    if (!parsedData.success) {
      const { fieldErrors } = parsedData.error.flatten();
      const zodErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([field, errors]) => [field, errors[0]])
      );
      console.log(zodErrors);
      return new Response(JSON.stringify({ errors: zodErrors }), {
        status: 400,
      });
    }

    const { username, email, password } = parsedData.data;
    const emailLower = email.toLowerCase();

    // Check if a user with the given email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, emailLower));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email is already in use." },
        { status: 400 }
      );
    }

    // Hash the password before saving it
    const password_hash = await bcrypt.hash(password, 13);

    // Insert the new user into the database
    await db.insert(users).values({
      id: uuidv4(),
      username,
      email: emailLower,
      password_hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Registration failed (catched) " },
      { status: 500 }
    );
  }
}

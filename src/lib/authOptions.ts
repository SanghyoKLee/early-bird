import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Query the user from the database
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email));
        const user = userResult[0];

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Compare hashed password with the provided password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        // Return user data to include in the session
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Use 'as' to tell TS you know the shape
        const customUser = user as {
          id: string;
          username: string;
          email: string;
        };
        token.id = customUser.id;
        token.username = customUser.username;
        token.email = customUser.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

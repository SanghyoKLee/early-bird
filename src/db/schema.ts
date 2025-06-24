import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// USERS TABLE (uuid PK)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 32 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(), // update this via app/trigger
  scan_start_at: timestamp("scan_start", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
});

// QRCODES TABLE (serial PK, user_id is uuid FK)
export const qrcodes = pgTable("qrcodes", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  code: uuid("code").notNull().unique(), // secure QR payload
  created_at: timestamp("created_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
});

// SCANS TABLE (serial PK, user_id is uuid FK, qrcode_id is int FK)
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  qrcode_id: integer("qrcode_id")
    .notNull()
    .references(() => qrcodes.id),
  scanned_at: timestamp("scanned_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  scheduled_wake_time: time("scheduled_wake_time").notNull(), // snapshot of target
  success: boolean("success").notNull(), // true if scan was on time
});

// USER SETTINGS (user_id is uuid FK)
export const userSettings = pgTable("user_settings", {
  user_id: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  target_wake_time: time("target_wake_time"),
});

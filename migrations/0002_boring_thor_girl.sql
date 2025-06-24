ALTER TABLE "scans" ADD COLUMN "scheduled_wake_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "scans" ADD COLUMN "success" boolean NOT NULL;
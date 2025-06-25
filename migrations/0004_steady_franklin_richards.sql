ALTER TABLE "users" ALTER COLUMN "scan_start" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "scan_start" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "scan_start" DROP NOT NULL;
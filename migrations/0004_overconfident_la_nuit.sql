ALTER TYPE "public"."trip_category" ADD VALUE 'Normal';--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "location" text NOT NULL;
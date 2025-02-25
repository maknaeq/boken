CREATE TYPE "public"."trip_category" AS ENUM('Backpacking', 'Luxe', 'Roadtrip', 'Digital Nomad');--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "category" "trip_category";
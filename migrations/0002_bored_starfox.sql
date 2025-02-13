ALTER TABLE "trips" DROP CONSTRAINT "trips_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "user_id" DROP NOT NULL;
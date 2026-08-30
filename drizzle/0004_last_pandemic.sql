CREATE TYPE "public"."user_role" AS ENUM('superadmin', 'admin');--> statement-breakpoint
CREATE TABLE "user_site_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"site_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"password_salt" text NOT NULL,
	"password_hash" text NOT NULL,
	"password_kdf" text DEFAULT 'scrypt' NOT NULL,
	"profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_site_access" ADD CONSTRAINT "user_site_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_site_access" ADD CONSTRAINT "user_site_access_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_site_access_user_site_uidx" ON "user_site_access" USING btree ("user_id","site_id");--> statement-breakpoint
CREATE INDEX "user_site_access_site_id_idx" ON "user_site_access" USING btree ("site_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_lower_uidx" ON "users" USING btree (lower("username"));--> statement-breakpoint
CREATE UNIQUE INDEX "users_display_name_uidx" ON "users" USING btree ("display_name");--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_site_access" ENABLE ROW LEVEL SECURITY;
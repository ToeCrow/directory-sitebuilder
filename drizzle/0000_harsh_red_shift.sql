CREATE TYPE "public"."comparison_row_type" AS ENUM('text', 'boolean');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "article_product_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"heading" text NOT NULL,
	"intro" text,
	"image_src" text,
	"image_alt" text,
	"what_it_is" text NOT NULL,
	"why_it_earns_a_spot" text[] DEFAULT '{}'::text[] NOT NULL,
	"where_it_falls_short" text[] DEFAULT '{}'::text[] NOT NULL,
	"best_for" text NOT NULL,
	"skip_if" text NOT NULL,
	"product_slug" text,
	"product_variant" text,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"intro" text[] DEFAULT '{}'::text[] NOT NULL,
	"research_note_title" text NOT NULL,
	"research_note_content" text NOT NULL,
	"author" text,
	"og_image_src" text,
	"og_image_alt" text,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"content_updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "buying_guide_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comparison_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"type" "comparison_row_type" DEFAULT 'text' NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "footer_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"short_description" text NOT NULL,
	"best_for" text NOT NULL,
	"price_from" text NOT NULL,
	"features" text[] DEFAULT '{}'::text[] NOT NULL,
	"pros" text[] DEFAULT '{}'::text[] NOT NULL,
	"cons" text[] DEFAULT '{}'::text[] NOT NULL,
	"affiliate_url" text NOT NULL,
	"has_affiliate_partnership" boolean DEFAULT false NOT NULL,
	"research_score_breakdown" jsonb,
	"badge" text,
	"comparison_rank" integer NOT NULL,
	"directory_sort_order" integer NOT NULL,
	"comparison" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"host" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_heroes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"eyebrow" text,
	"headline" text NOT NULL,
	"subheadline" text NOT NULL,
	"primary_cta" text NOT NULL,
	"secondary_cta" text,
	"secondary_cta_href" text,
	"image_src" text,
	"image_src_mobile" text,
	"image_alt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"section_key" text NOT NULL,
	"title" text,
	"description" text,
	"config" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_top_picks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"badge_override" text,
	"heading_override" text,
	"description_override" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"niche" text NOT NULL,
	"site_url" text NOT NULL,
	"header_brand_image" text,
	"favicon" text,
	"affiliate_disclosure" text NOT NULL,
	"newsletter_title" text NOT NULL,
	"newsletter_description" text NOT NULL,
	"newsletter_button_text" text NOT NULL,
	"newsletter_success_message" text NOT NULL,
	"ads_primary" text,
	"ads_secondary" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"features" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_product_sections" ADD CONSTRAINT "article_product_sections_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buying_guide_sections" ADD CONSTRAINT "buying_guide_sections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparison_rows" ADD CONSTRAINT "comparison_rows_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "footer_links" ADD CONSTRAINT "footer_links_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_domains" ADD CONSTRAINT "site_domains_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_heroes" ADD CONSTRAINT "site_heroes_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_sections" ADD CONSTRAINT "site_sections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_top_picks" ADD CONSTRAINT "site_top_picks_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_top_picks" ADD CONSTRAINT "site_top_picks_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "articles_site_slug_uidx" ON "articles" USING btree ("site_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "comparison_rows_site_key_uidx" ON "comparison_rows" USING btree ("site_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "products_site_slug_uidx" ON "products" USING btree ("site_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "site_domains_host_uidx" ON "site_domains" USING btree ("host");--> statement-breakpoint
CREATE UNIQUE INDEX "site_heroes_site_uidx" ON "site_heroes" USING btree ("site_id");--> statement-breakpoint
CREATE UNIQUE INDEX "site_sections_site_key_uidx" ON "site_sections" USING btree ("site_id","section_key");--> statement-breakpoint
CREATE UNIQUE INDEX "site_top_picks_site_product_uidx" ON "site_top_picks" USING btree ("site_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sites_slug_uidx" ON "sites" USING btree ("slug");
ALTER TABLE "sites" ADD COLUMN "favicon" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "content" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "content" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "article_product_sections" ADD COLUMN "product_slug" text;--> statement-breakpoint
ALTER TABLE "article_product_sections" ADD COLUMN "product_variant" text;

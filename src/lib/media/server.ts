import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { media, sites } from "@/lib/db/schema";
import {
  createStorageKey,
  isMediaKind,
  MEDIA_BUCKET,
  validateImageUpload,
  type MediaKind,
} from "@/lib/media";
import { optimizeImageBuffer } from "@/lib/media/optimize";

export function resolveSupabaseUrl(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    null
  );
}

export function resolveSupabaseServiceRoleKey(): string | null {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    null
  );
}

function requireStorageClient(): SupabaseClient {
  const url = resolveSupabaseUrl();
  const key = resolveSupabaseServiceRoleKey();
  if (!url || !key) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type MediaListItem = {
  id: string;
  publicUrl: string;
  originalFilename: string;
  mimeType: string;
  width: number;
  height: number;
  altText: string | null;
  createdAt: string;
};

export async function listMediaForSite(siteId: string): Promise<MediaListItem[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(media)
    .where(eq(media.siteId, siteId))
    .orderBy(desc(media.createdAt));

  return rows.map((row) => ({
    id: row.id,
    publicUrl: row.publicUrl,
    originalFilename: row.originalFilename,
    mimeType: row.mimeType,
    width: row.width,
    height: row.height,
    altText: row.altText,
    createdAt: row.createdAt.toISOString(),
  }));
}

export type UploadedMedia = MediaListItem;

export async function uploadImage(input: {
  siteId: string;
  kind: string;
  bytes: Uint8Array;
  mimeType: string;
  filename: string;
  altText?: string | null;
}): Promise<UploadedMedia> {
  if (!isMediaKind(input.kind)) {
    throw new Error("Invalid media kind.");
  }
  const kind: MediaKind = input.kind;

  const validated = validateImageUpload({
    bytes: input.bytes,
    mimeType: input.mimeType,
    filename: input.filename,
  });
  if (!validated.ok) {
    throw new Error(validated.error);
  }

  const db = getDb();
  const [site] = await db
    .select({ id: sites.id, slug: sites.slug })
    .from(sites)
    .where(eq(sites.id, input.siteId))
    .limit(1);
  if (!site) {
    throw new Error("Site not found.");
  }

  const optimized = await optimizeImageBuffer(input.bytes);
  const id = randomUUID();
  const storageKey = createStorageKey({
    siteSlug: site.slug,
    kind,
    id,
    ext: optimized.ext,
  });

  const client = requireStorageClient();
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(storageKey, optimized.bytes, {
    contentType: optimized.mimeType,
    upsert: false,
  });
  if (error) {
    throw new Error(
      error.message.includes("Bucket not found")
        ? "Storage bucket \"media\" is missing. Create a public bucket named media in Supabase."
        : `Could not upload image: ${error.message}`,
    );
  }

  const { data } = client.storage.from(MEDIA_BUCKET).getPublicUrl(storageKey);
  const publicUrl = data.publicUrl;
  const altText = input.altText?.trim() ? input.altText.trim() : null;

  const [inserted] = await db
    .insert(media)
    .values({
      id,
      siteId: site.id,
      storageKey,
      publicUrl,
      originalFilename: input.filename.slice(0, 300),
      mimeType: optimized.mimeType,
      width: optimized.width,
      height: optimized.height,
      altText,
    })
    .returning();

  if (!inserted) {
    throw new Error("Could not save media metadata.");
  }

  return {
    id: inserted.id,
    publicUrl: inserted.publicUrl,
    originalFilename: inserted.originalFilename,
    mimeType: inserted.mimeType,
    width: inserted.width,
    height: inserted.height,
    altText: inserted.altText,
    createdAt: inserted.createdAt.toISOString(),
  };
}

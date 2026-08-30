export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 1920;
export const WEBP_QUALITY = 80;
export const MEDIA_BUCKET = "media";

export const MEDIA_KINDS = ["products", "articles", "general"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const IMAGE_URL_MAX = 2000;
export const IMAGE_ALT_MAX = 300;

const SITE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];

export type DetectedImageFormat = "jpeg" | "png" | "webp";

export type ValidateImageUploadInput = {
  bytes: Uint8Array;
  mimeType: string;
  filename: string;
};

export type ValidateImageUploadResult =
  | { ok: true; format: DetectedImageFormat }
  | { ok: false; error: string };

function startsWithBytes(bytes: Uint8Array, magic: readonly number[]): boolean {
  if (bytes.length < magic.length) return false;
  return magic.every((value, index) => bytes[index] === value);
}

function isWebp(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  const riff =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46;
  const webp =
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  return riff && webp;
}

function looksLikeSvg(bytes: Uint8Array, mimeType: string, filename: string): boolean {
  if (mimeType.toLowerCase().includes("svg")) return true;
  if (filename.toLowerCase().endsWith(".svg")) return true;
  const head = new TextDecoder("utf-8", { fatal: false })
    .decode(bytes.slice(0, 256))
    .trimStart()
    .toLowerCase();
  return head.startsWith("<svg") || head.startsWith("<?xml");
}

export function detectImageFormat(bytes: Uint8Array): DetectedImageFormat | null {
  if (startsWithBytes(bytes, JPEG_MAGIC)) return "jpeg";
  if (startsWithBytes(bytes, PNG_MAGIC)) return "png";
  if (isWebp(bytes)) return "webp";
  return null;
}

export function validateImageUpload(
  input: ValidateImageUploadInput,
): ValidateImageUploadResult {
  if (input.bytes.byteLength === 0) {
    return { ok: false, error: "File is empty." };
  }
  if (input.bytes.byteLength > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image is larger than 8 MB." };
  }
  if (looksLikeSvg(input.bytes, input.mimeType, input.filename)) {
    return { ok: false, error: "SVG uploads are not allowed." };
  }

  const format = detectImageFormat(input.bytes);
  if (!format) {
    return { ok: false, error: "File is not a JPEG, PNG, or WebP image." };
  }

  const mime = input.mimeType.toLowerCase();
  const mimeMatches =
    (format === "jpeg" && (mime === "image/jpeg" || mime === "image/jpg" || mime === "")) ||
    (format === "png" && (mime === "image/png" || mime === "")) ||
    (format === "webp" && (mime === "image/webp" || mime === "")) ||
    mime.startsWith("image/");

  if (mime && !mimeMatches && mime !== "application/octet-stream") {
    return { ok: false, error: "File type does not match the image contents." };
  }

  return { ok: true, format };
}

export function isMediaKind(value: string): value is MediaKind {
  return (MEDIA_KINDS as readonly string[]).includes(value);
}

export function createStorageKey(options: {
  siteSlug: string;
  kind: MediaKind;
  id: string;
  ext: string;
}): string {
  if (!SITE_SLUG_PATTERN.test(options.siteSlug)) {
    throw new Error("Invalid site slug for storage key.");
  }
  if (!isMediaKind(options.kind)) {
    throw new Error("Invalid media kind for storage key.");
  }
  if (!UUID_PATTERN.test(options.id)) {
    throw new Error("Invalid id for storage key.");
  }
  const ext = options.ext.replace(/^\./, "").toLowerCase();
  if (ext !== "webp" && ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
    throw new Error("Invalid storage key extension.");
  }
  const normalizedExt = ext === "jpeg" ? "jpg" : ext;
  return `sites/${options.siteSlug}/${options.kind}/${options.id}.${normalizedExt}`;
}

export function isOptionalImageReference(
  value: string | null | undefined,
): boolean {
  if (!value) return true;
  return isSupportedImageReference(value);
}

export function isSupportedImageReference(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("\0")) return false;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("data:") ||
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  if (trimmed.startsWith("//")) return false;

  if (trimmed.startsWith("/")) {
    if (trimmed.includes("..")) return false;
    return trimmed.length <= IMAGE_URL_MAX;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false;
    }
    return trimmed.length <= IMAGE_URL_MAX;
  } catch {
    return false;
  }
}

export function isSupabaseStorageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isSupabaseHost =
      host.endsWith(".supabase.co") || host.endsWith(".supabase.com");
    return (
      isSupabaseHost &&
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.pathname.includes("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}

export type ProductContentImage = { src: string; alt: string };

export function mergeProductImage(
  content: Record<string, unknown>,
  image: ProductContentImage | null,
): Record<string, unknown> {
  const next = { ...content };
  if (image?.src && image.alt) {
    next.image = { src: image.src, alt: image.alt };
  } else {
    delete next.image;
  }
  return next;
}

export type RoundupImage = { src: string; alt: string };

export function resolveRoundupSectionImage(
  catalogProduct: { image?: RoundupImage } | undefined,
  section: { image?: RoundupImage },
): RoundupImage | undefined {
  if (catalogProduct?.image?.src) {
    return catalogProduct.image;
  }
  if (section.image?.src) {
    return section.image;
  }
  return undefined;
}

export function imageFromUnknown(value: unknown): { src: string; alt: string } {
  if (!value || typeof value !== "object") {
    return { src: "", alt: "" };
  }
  const record = value as { src?: unknown; alt?: unknown };
  return {
    src: typeof record.src === "string" ? record.src : "",
    alt: typeof record.alt === "string" ? record.alt : "",
  };
}

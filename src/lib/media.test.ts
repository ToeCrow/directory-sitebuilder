import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import {
  createStorageKey,
  isOptionalImageReference,
  isSupportedImageReference,
  isSupabaseStorageUrl,
  MAX_IMAGE_DIMENSION,
  mergeProductImage,
  resolveRoundupSectionImage,
  validateImageUpload,
} from "./media";
import { optimizeImageBuffer } from "./media/optimize";

const UUID = "11111111-1111-4111-8111-111111111111";

async function jpegBytes(width = 40, height = 30): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 200, g: 40, b: 40 },
    },
  })
    .jpeg()
    .toBuffer();
}

async function pngWithAlpha(width = 32, height = 32): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toBuffer();
}

describe("validateImageUpload", () => {
  it("accepts a real jpeg", async () => {
    const bytes = await jpegBytes();
    const result = validateImageUpload({
      bytes,
      mimeType: "image/jpeg",
      filename: "photo.jpg",
    });
    assert.deepEqual(result, { ok: true, format: "jpeg" });
  });

  it("rejects empty files", () => {
    const result = validateImageUpload({
      bytes: new Uint8Array(),
      mimeType: "image/jpeg",
      filename: "empty.jpg",
    });
    assert.equal(result.ok, false);
  });

  it("rejects files over 8 MB", () => {
    const bytes = new Uint8Array(8 * 1024 * 1024 + 1);
    bytes[0] = 0xff;
    bytes[1] = 0xd8;
    bytes[2] = 0xff;
    const result = validateImageUpload({
      bytes,
      mimeType: "image/jpeg",
      filename: "huge.jpg",
    });
    assert.equal(result.ok, false);
  });

  it("rejects SVG even when named as png", () => {
    const svg = new TextEncoder().encode(
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    );
    const result = validateImageUpload({
      bytes: svg,
      mimeType: "image/png",
      filename: "icon.png",
    });
    assert.equal(result.ok, false);
  });

  it("rejects non-image bytes", () => {
    const result = validateImageUpload({
      bytes: new TextEncoder().encode("not an image"),
      mimeType: "image/jpeg",
      filename: "note.jpg",
    });
    assert.equal(result.ok, false);
  });
});

describe("createStorageKey", () => {
  it("builds a collision-resistant site-scoped key", () => {
    assert.equal(
      createStorageKey({
        siteSlug: "side-sleeper",
        kind: "products",
        id: UUID,
        ext: "webp",
      }),
      `sites/side-sleeper/products/${UUID}.webp`,
    );
  });

  it("rejects path traversal in the site slug", () => {
    assert.throws(() =>
      createStorageKey({
        siteSlug: "../evil",
        kind: "general",
        id: UUID,
        ext: "png",
      }),
    );
  });

  it("rejects a user-controlled id that is not a uuid", () => {
    assert.throws(() =>
      createStorageKey({
        siteSlug: "findworthnow",
        kind: "articles",
        id: "not-a-uuid",
        ext: "webp",
      }),
    );
  });
});

describe("isSupportedImageReference", () => {
  it("accepts legacy public paths", () => {
    assert.equal(
      isSupportedImageReference("/sites/side-sleeper/products/saatva-classic.png"),
      true,
    );
  });

  it("accepts supabase storage URLs", () => {
    const url =
      "https://abcdefgh.supabase.co/storage/v1/object/public/media/sites/side-sleeper/products/11111111-1111-4111-8111-111111111111.webp";
    assert.equal(isSupportedImageReference(url), true);
    assert.equal(isSupabaseStorageUrl(url), true);
  });

  it("accepts other https URLs", () => {
    assert.equal(
      isSupportedImageReference("https://cdn.example.com/pillow.jpg"),
      true,
    );
  });

  it("rejects data URLs, javascript, and traversal", () => {
    assert.equal(isSupportedImageReference("data:image/png;base64,aaa"), false);
    assert.equal(isSupportedImageReference("javascript:alert(1)"), false);
    assert.equal(isSupportedImageReference("/sites/../secret.png"), false);
    assert.equal(isSupportedImageReference("//evil.example/x.png"), false);
    assert.equal(isSupportedImageReference(""), false);
  });

  it("treats empty optional references as valid", () => {
    assert.equal(isOptionalImageReference(null), true);
    assert.equal(isOptionalImageReference(""), true);
    assert.equal(isOptionalImageReference("/sites/x.png"), true);
    assert.equal(isOptionalImageReference("javascript:alert(1)"), false);
  });
});

describe("mergeProductImage", () => {
  it("sets image without dropping other content keys", () => {
    const merged = mergeProductImage(
      { category: "pillow", typeLabel: "Pillow" },
      { src: "https://example.com/a.webp", alt: "A pillow" },
    );
    assert.deepEqual(merged, {
      category: "pillow",
      typeLabel: "Pillow",
      image: { src: "https://example.com/a.webp", alt: "A pillow" },
    });
  });

  it("removes image when cleared", () => {
    const merged = mergeProductImage(
      {
        category: "mattress",
        image: { src: "/sites/x.png", alt: "X" },
      },
      null,
    );
    assert.deepEqual(merged, { category: "mattress" });
  });
});

describe("resolveRoundupSectionImage", () => {
  it("prefers the catalog product image", () => {
    const resolved = resolveRoundupSectionImage(
      { image: { src: "/product.png", alt: "Product" } },
      { image: { src: "/section.png", alt: "Section" } },
    );
    assert.deepEqual(resolved, { src: "/product.png", alt: "Product" });
  });

  it("falls back to the section image when the product has none", () => {
    const resolved = resolveRoundupSectionImage(
      { image: undefined },
      { image: { src: "/legacy.png", alt: "Legacy" } },
    );
    assert.deepEqual(resolved, { src: "/legacy.png", alt: "Legacy" });
  });

  it("returns undefined when neither has an image", () => {
    assert.equal(resolveRoundupSectionImage(undefined, {}), undefined);
  });
});

describe("optimizeImageBuffer", () => {
  it("downscales a large jpeg to webp", async () => {
    const source = await jpegBytes(2400, 1600);
    const result = await optimizeImageBuffer(source);
    assert.equal(result.mimeType, "image/webp");
    assert.equal(result.ext, "webp");
    assert.ok(result.width <= MAX_IMAGE_DIMENSION);
    assert.ok(result.height <= MAX_IMAGE_DIMENSION);
    assert.ok(result.bytes.byteLength < source.byteLength);
  });

  it("keeps a transparent png as png", async () => {
    const source = await pngWithAlpha(64, 48);
    const result = await optimizeImageBuffer(source);
    assert.equal(result.mimeType, "image/png");
    assert.equal(result.ext, "png");
    const meta = await sharp(result.bytes).metadata();
    assert.equal(meta.hasAlpha, true);
  });
});

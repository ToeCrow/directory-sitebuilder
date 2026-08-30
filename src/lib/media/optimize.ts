import sharp from "sharp";
import { MAX_IMAGE_DIMENSION, WEBP_QUALITY } from "@/lib/media";

export type OptimizedImage = {
  bytes: Buffer;
  mimeType: "image/webp" | "image/png" | "image/jpeg";
  ext: "webp" | "png" | "jpg";
  width: number;
  height: number;
};

export async function optimizeImageBuffer(
  bytes: Uint8Array,
): Promise<OptimizedImage> {
  const image = sharp(Buffer.from(bytes), { failOn: "none" });
  const metadata = await image.metadata();
  const hasAlpha = Boolean(metadata.hasAlpha);
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (width < 1 || height < 1) {
    throw new Error("Could not read image dimensions.");
  }

  const longest = Math.max(width, height);
  const resized =
    longest > MAX_IMAGE_DIMENSION
      ? image.resize({
          width: width >= height ? MAX_IMAGE_DIMENSION : undefined,
          height: height > width ? MAX_IMAGE_DIMENSION : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
      : image;

  if (hasAlpha) {
    const output = await resized.png({ compressionLevel: 9 }).toBuffer();
    const outMeta = await sharp(output).metadata();
    return {
      bytes: output,
      mimeType: "image/png",
      ext: "png",
      width: outMeta.width ?? width,
      height: outMeta.height ?? height,
    };
  }

  const output = await resized.webp({ quality: WEBP_QUALITY }).toBuffer();
  const outMeta = await sharp(output).metadata();
  return {
    bytes: output,
    mimeType: "image/webp",
    ext: "webp",
    width: outMeta.width ?? width,
    height: outMeta.height ?? height,
  };
}

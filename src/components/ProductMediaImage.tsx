"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

type ProductMediaImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function ProductMediaImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: ProductMediaImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(
        "object-contain object-center",
        className,
      )}
    />
  );
}

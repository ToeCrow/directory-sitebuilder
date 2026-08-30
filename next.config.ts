import type { NextConfig } from "next";

function supabaseImageRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "**.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
    {
      protocol: "https",
      hostname: "**.supabase.com",
      pathname: "/storage/v1/object/public/**",
    },
  ];

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  if (supabaseUrl) {
    try {
      const host = new URL(supabaseUrl).hostname;
      patterns.unshift({
        protocol: "https",
        hostname: host,
        pathname: "/storage/v1/object/public/**",
      });
    } catch {
      // Ignore invalid env; wildcard patterns still cover typical projects.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImageRemotePatterns(),
  },
};

export default nextConfig;

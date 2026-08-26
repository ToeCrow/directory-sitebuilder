import { headers } from "next/headers";
import { resolvePublicBasePath } from "@/lib/paths";

/** Server helper: publicBasePath for the current request. */
export async function getRequestPublicBasePath(
  siteSlug: string,
): Promise<string> {
  const host = (await headers()).get("host") ?? "";
  return resolvePublicBasePath(siteSlug, host);
}

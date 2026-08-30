import { NextResponse } from "next/server";
import { clickEventSchema } from "@/lib/admin/click-schema";
import { incrementClick } from "@/lib/click-tracking-db";
import { findSiteBySlug } from "@/lib/db/repositories/sites";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = clickEventSchema.safeParse(raw);
  if (!parsed.success) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const site = await findSiteBySlug(parsed.data.siteSlug);
    if (site) {
      await incrementClick({
        siteId: site.id,
        sourceType: parsed.data.sourceType,
        sourceId: parsed.data.sourceId,
        sourcePath: parsed.data.sourcePath,
        placement: parsed.data.placement,
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
        targetUrl: parsed.data.targetUrl,
        label: parsed.data.label,
      });
    }
  } catch (error) {
    console.error("click tracking failed", error);
  }

  return new NextResponse(null, { status: 204 });
}

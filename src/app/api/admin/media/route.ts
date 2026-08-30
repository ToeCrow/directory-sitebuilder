import { NextResponse } from "next/server";
import { userCanAccessSite } from "@/lib/admin-access";
import { requireAdminUser } from "@/lib/admin/session";
import { getAdminSiteSlug } from "@/lib/admin/sites";
import { isMediaKind } from "@/lib/media";
import { listMediaForSite, uploadImage } from "@/lib/media/server";

async function requireAdminForSite(
  siteId: string,
): Promise<{ error: NextResponse } | { user: Awaited<ReturnType<typeof requireAdminUser>> }> {
  try {
    const user = await requireAdminUser();
    const siteSlug = await getAdminSiteSlug(siteId);
    if (!siteSlug || !userCanAccessSite(user, siteSlug)) {
      return {
        error: NextResponse.json({ error: "Site not found" }, { status: 404 }),
      };
    }
    return { user };
  } catch {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}

export async function GET(request: Request) {
  const siteId = new URL(request.url).searchParams.get("siteId");
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  const access = await requireAdminForSite(siteId);
  if ("error" in access) return access.error;

  try {
    const items = await listMediaForSite(siteId);
    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not list media.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const siteId = String(form.get("siteId") ?? "");
  const kind = String(form.get("kind") ?? "");
  const altText = String(form.get("altText") ?? "");
  const file = form.get("file");

  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  const access = await requireAdminForSite(siteId);
  if ("error" in access) return access.error;

  if (!isMediaKind(kind)) {
    return NextResponse.json({ error: "kind is required" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "An image file is required" }, { status: 400 });
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const uploaded = await uploadImage({
      siteId,
      kind,
      bytes,
      mimeType: file.type || "application/octet-stream",
      filename: file.name || "upload",
      altText,
    });
    return NextResponse.json(uploaded);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not upload image.";
    const status = /not configured|not found|not allowed|not a JPEG|larger than|empty|SVG/i.test(
      message,
    )
      ? 400
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

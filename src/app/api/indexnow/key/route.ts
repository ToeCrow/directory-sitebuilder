import { NextResponse } from "next/server";
import { getIndexNowKey } from "@/lib/indexnow";

export async function GET() {
  let key: string | undefined;
  try {
    key = getIndexNowKey();
  } catch {
    return new NextResponse("Invalid IndexNow key configuration", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (!key) {
    return new NextResponse("IndexNow key not configured", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // IndexNow verification is a strict string match — no trailing newline.
  return new NextResponse(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

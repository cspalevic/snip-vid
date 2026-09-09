import { NextRequest, NextResponse } from "next/server";
import {
  assertYouTubeUrl,
  getVideoInfo,
  toYoutubeError,
  urlFromBody,
} from "@/lib/youtube";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const url = assertYouTubeUrl(urlFromBody(body));
    const info = await getVideoInfo(url);
    return NextResponse.json(info);
  } catch (error) {
    const youtubeError = toYoutubeError(error);
    return NextResponse.json(
      { error: youtubeError.message },
      { status: youtubeError.status },
    );
  }
}

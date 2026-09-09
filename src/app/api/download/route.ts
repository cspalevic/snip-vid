import { NextRequest, NextResponse } from "next/server";
import {
  assertYouTubeUrl,
  getDownloadStream,
  toYoutubeError,
  urlFromBody,
} from "@/lib/youtube";
import { sanitizeFilename } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const url = assertYouTubeUrl(urlFromBody(body));
    const { stream, title } = await getDownloadStream(url);
    const filename = `${sanitizeFilename(title)}.mp4`;

    return new Response(stream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const youtubeError = toYoutubeError(error);
    return NextResponse.json(
      { error: youtubeError.message },
      { status: youtubeError.status },
    );
  }
}

import "server-only";

import { Innertube, Log, type Types } from "youtubei.js";
import type { VideoInfo } from "@/lib/types";

Log.setLevel(Log.Level.NONE);

const VIDEO_ID_RE = /^[\w-]{11}$/;
const DOWNLOAD_CLIENTS: Types.InnerTubeClient[] = [
  "ANDROID",
  "IOS",
  "WEB",
  "TV",
  "WEB_EMBEDDED",
];

let clientPromise: Promise<Innertube> | null = null;

function getClient() {
  clientPromise ??= Innertube.create({
    retrieve_player: true,
    enable_session_cache: true,
  }).catch((error: unknown) => {
    clientPromise = null;
    throw error;
  });

  return clientPromise;
}

export function extractVideoId(url: string) {
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname === "youtu.be" || parsed.hostname === "www.youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0]?.slice(0, 11);
      return id && VIDEO_ID_RE.test(id) ? id : null;
    }

    const queryId = parsed.searchParams.get("v");
    if (queryId && VIDEO_ID_RE.test(queryId)) return queryId;

    const pathId = parsed.pathname.match(
      /\/(?:shorts|embed|live|v)\/([\w-]{11})/,
    )?.[1];
    return pathId ?? null;
  } catch {
    return null;
  }
}

export function assertYouTubeUrl(url: unknown): string {
  if (typeof url !== "string" || !url.trim()) {
    throw new YoutubeError("Paste a YouTube URL to get started.", 400);
  }

  const trimmed = url.trim();
  if (!extractVideoId(trimmed)) {
    throw new YoutubeError("That does not look like a valid YouTube URL.", 400);
  }

  return trimmed;
}

export function urlFromBody(body: unknown): unknown {
  if (typeof body === "object" && body !== null && "url" in body) {
    return body.url;
  }

  return undefined;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new YoutubeError("That does not look like a valid YouTube URL.", 400);
  }

  const yt = await getClient();
  let lastError: unknown;

  for (const client of DOWNLOAD_CLIENTS) {
    try {
      const info = await yt.getBasicInfo(videoId, { client });
      const mapped = mapVideoInfo(info, videoId);
      if (mapped) return mapped;
    } catch (error) {
      lastError = error;
    }
  }

  throw (
    lastError ??
    new YoutubeError("Could not load that video from YouTube right now.", 502)
  );
}

export async function getDownloadStream(url: string) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new YoutubeError("That does not look like a valid YouTube URL.", 400);
  }

  const yt = await getClient();
  let lastError: unknown;

  for (const client of DOWNLOAD_CLIENTS) {
    try {
      const info = await yt.getBasicInfo(videoId, { client });
      const title = info.basic_info.title ?? "video";
      const stream = await downloadBestMp4(info);
      return { stream, title };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new YoutubeError("Could not download this video.", 502);
}

function mapVideoInfo(
  info: Awaited<ReturnType<Innertube["getBasicInfo"]>>,
  videoId: string,
): VideoInfo | null {
  const details = info.basic_info;
  if (!details.title) return null;

  const thumbnails = Array.isArray(details.thumbnail) ? details.thumbnail : [];
  const thumbnail =
    [...thumbnails].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ??
    `https://i.ytimg.com/vi/${details.id ?? videoId}/hqdefault.jpg`;

  return {
    title: details.title,
    author: details.author ?? details.channel?.name ?? "Unknown",
    durationSeconds: Number(details.duration) || 0,
    thumbnailUrl: thumbnail.replace(/^http:\/\//, "https://"),
    videoId: details.id ?? videoId,
    viewCount: Number(details.view_count) || 0,
  };
}

async function downloadBestMp4(info: Awaited<ReturnType<Innertube["getBasicInfo"]>>) {
  const attempts: Types.DownloadOptions[] = [
    { type: "video+audio", quality: "best", format: "mp4" },
    { type: "video+audio", quality: "best", format: "any" },
    { type: "video", quality: "best", format: "mp4" },
  ];

  let lastError: unknown;
  for (const options of attempts) {
    try {
      return await info.download(options);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new YoutubeError("No downloadable formats were returned.", 502);
}

export class YoutubeError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "YoutubeError";
    this.status = status;
  }
}

export function toYoutubeError(error: unknown) {
  if (error instanceof YoutubeError) return error;

  const message = error instanceof Error ? error.message : "Could not reach YouTube.";
  if (
    /matching formats|valid URL to decipher|streaming data|unplayable|login required|403|unavailable|interstitial/i.test(
      message,
    )
  ) {
    return new YoutubeError(
      "YouTube is blocking the download for this video right now. Try a different public video, or try again in a bit.",
      502,
    );
  }

  return new YoutubeError(message, 502);
}

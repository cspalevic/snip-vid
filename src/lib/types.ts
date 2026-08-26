export type OutputFormat = "mp4" | "gif";

export type VideoInfo = {
  title: string;
  author: string;
  durationSeconds: number;
  thumbnailUrl: string;
  videoId: string;
  viewCount: number;
};

export const MIME_TYPES = {
  mp4: "video/mp4",
  gif: "image/gif",
} as const satisfies Record<OutputFormat, string>;

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { MIME_TYPES, type OutputFormat } from "@/lib/types";

const CORE_BASE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

export async function loadFfmpeg() {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { toBlobURL } = await import("@ffmpeg/util");
  const ffmpeg = new FFmpeg();

  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpeg;
}

export async function convertMedia(
  ffmpeg: FFmpeg,
  input: Uint8Array,
  options: {
    start?: string;
    end?: string;
    type: OutputFormat;
    onProgress?: (progress: number) => void;
  },
) {
  const { start, end, type, onProgress } = options;
  const outputName = type === "gif" ? "output.gif" : "output.mp4";
  const onProgressEvent = ({ progress }: { progress: number }) => {
    onProgress?.(Math.min(1, Math.max(0, progress)));
  };

  ffmpeg.on("progress", onProgressEvent);

  try {
    await ffmpeg.writeFile("input.mp4", input);

    const args: string[] = [];
    if (start) args.push("-ss", start);
    if (end) args.push("-to", end);
    args.push("-i", "input.mp4");

    if (type === "gif") {
      args.push(
        "-vf",
        "fps=12,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
      );
    } else {
      args.push("-c", "copy");
    }

    args.push(outputName);

    const code = await ffmpeg.exec(args);
    if (code !== 0) {
      throw new Error("ffmpeg could not convert this clip.");
    }

    const data = await ffmpeg.readFile(outputName);
    if (typeof data === "string") {
      throw new Error("Unexpected ffmpeg output.");
    }

    return new Blob([data as BlobPart], { type: MIME_TYPES[type] });
  } finally {
    ffmpeg.off("progress", onProgressEvent);
    await ffmpeg.deleteFile("input.mp4").catch(() => undefined);
    await ffmpeg.deleteFile(outputName).catch(() => undefined);
  }
}

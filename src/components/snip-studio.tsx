"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckIcon,
  ClipboardPasteIcon,
  ClockIcon,
  DownloadIcon,
  FilmIcon,
  ImageIcon,
  Link2Icon,
  Loader2Icon,
  ScissorsIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { convertMedia, loadFfmpeg } from "@/lib/ffmpeg";
import {
  formatBytes,
  formatDuration,
  formatViews,
  isLikelyYouTubeUrl,
  sanitizeFilename,
  TIME_PATTERN,
} from "@/lib/format";
import { MIME_TYPES, type OutputFormat, type VideoInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

type FfmpegStatus = "loading" | "ready" | "unavailable";
type JobStatus = "idle" | "fetching" | "downloading" | "converting" | "done";

type ResultFile = {
  url: string;
  type: OutputFormat;
  filename: string;
};

export function SnipStudio() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [format, setFormat] = useState<OutputFormat>("mp4");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [ffmpegStatus, setFfmpegStatus] = useState<FfmpegStatus>("loading");
  const [job, setJob] = useState<JobStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressHint, setProgressHint] = useState("");
  const [result, setResult] = useState<ResultFile | null>(null);

  const needsFfmpeg = format === "gif" || Boolean(start.trim() || end.trim());
  const busy = job === "fetching" || job === "downloading" || job === "converting";
  const gifNeedsClip =
    format === "gif" && info !== null && info.durationSeconds > 20 && !start && !end;

  const statusLabel = useMemo(() => {
    if (job === "fetching") return "Fetching video details";
    if (job === "downloading") return "Pulling the YouTube stream";
    if (job === "converting") {
      return format === "gif" ? "Spinning a GIF in your browser" : "Snipping with ffmpeg";
    }
    if (job === "done") return "Ready to save";
    return "Waiting for a link";
  }, [format, job]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const ffmpeg = await loadFfmpeg();
        if (cancelled) {
          ffmpeg.terminate();
          return;
        }
        ffmpegRef.current = ffmpeg;
        setFfmpegStatus("ready");
      } catch (error) {
        console.error("Failed to load ffmpeg.wasm", error);
        if (!cancelled) setFfmpegStatus("unavailable");
      }
    })();

    return () => {
      cancelled = true;
      abortRef.current?.abort();
      ffmpegRef.current?.terminate();
    };
  }, []);

  function updateUrl(next: string) {
    abortRef.current?.abort();
    setUrl(next);
    setInfo(null);
    setJob("idle");
    setProgress(0);
    setProgressHint("");
    setResult(null);
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }

  async function loadInfo() {
    if (!isLikelyYouTubeUrl(url)) {
      toast.error("Paste a valid YouTube URL first.");
      return;
    }

    setJob("fetching");
    try {
      const response = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not load that video.");
      }
      setInfo(data as VideoInfo);
      setJob("idle");
      toast.success("Video locked in. Pick a format and snip.");
    } catch (error) {
      setJob("idle");
      toast.error(error instanceof Error ? error.message : "Could not load that video.");
    }
  }

  async function snip() {
    if (!info) {
      await loadInfo();
      return;
    }

    if (needsFfmpeg && ffmpegStatus !== "ready") {
      toast.error("ffmpeg.wasm is still warming up. Try again in a moment.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setJob("downloading");
    setProgress(8);
    setProgressHint("Contacting YouTube…");
    setResult(null);

    try {
      const bytes = await downloadVideoBytes(url.trim(), (received) => {
        setProgressHint(`Downloaded ${formatBytes(received)}`);
        setProgress(Math.min(55, 8 + Math.log10(received + 1) * 8));
      }, controller.signal);

      let blob = new Blob([bytes as BlobPart], { type: MIME_TYPES.mp4 });

      if (needsFfmpeg) {
        const ffmpeg = ffmpegRef.current;
        if (!ffmpeg) throw new Error("ffmpeg.wasm is not ready yet.");
        setJob("converting");
        setProgress(60);
        setProgressHint("Handing the clip to ffmpeg.wasm…");
        blob = await convertMedia(ffmpeg, bytes, {
          start: start.trim() || undefined,
          end: end.trim() || undefined,
          type: format,
          onProgress: (value) => {
            setProgress(60 + value * 38);
            setProgressHint("Encoding in your browser…");
          },
        });
      }

      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const objectUrl = URL.createObjectURL(blob);
      resultUrlRef.current = objectUrl;
      const filename = `${sanitizeFilename(info.title)}.${format}`;
      setResult({ url: objectUrl, type: format, filename });
      setJob("done");
      setProgress(100);
      setProgressHint("Clip ready");
      triggerDownload(objectUrl, filename);
      toast.success("Snipped. Your download should start any second.");
    } catch (error) {
      if (controller.signal.aborted) return;
      setJob("idle");
      setProgress(0);
      toast.error(error instanceof Error ? error.message : "Could not snip that video.");
    }
  }

  const ctaLabel = !info
    ? "Load video"
    : format === "gif"
      ? "Snip GIF"
      : start || end
        ? "Snip MP4"
        : "Download MP4";

  return (
    <Card className="border-border/60 bg-card/75 ring-foreground/8 w-full max-w-xl shadow-2xl shadow-black/5 backdrop-blur-xl dark:shadow-black/40">
      <CardHeader className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-2xl tracking-tight">
              Make a snip
            </CardTitle>
            <CardDescription className="mt-1 max-w-sm text-pretty">
              Drop in a YouTube link, trim the moment, and walk away with an MP4
              or GIF. Conversion stays in the browser.
            </CardDescription>
          </div>
          <FfmpegBadge status={ffmpegStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          role="form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!info) void loadInfo();
            else void snip();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="url" className="text-muted-foreground">
              YouTube URL
            </Label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Link2Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="url"
                  name="url"
                  type="url"
                  required
                  autoComplete="url"
                  inputMode="url"
                  placeholder="https://www.youtube.com/watch?v=…"
                  value={url}
                  onChange={(event) => updateUrl(event.target.value)}
                  className="h-11 bg-background/70 pr-2 pl-9 text-sm"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 shrink-0"
                aria-label="Paste from clipboard"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    updateUrl(text.trim());
                    toast.success("Pasted. Hit load when you are ready.");
                  } catch {
                    toast.error("Clipboard access was blocked.");
                  }
                }}
              >
                <ClipboardPasteIcon />
              </Button>
            </div>
          </div>

          {info ? (
            <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-500">
              <div className="bg-muted/40 ring-foreground/8 flex gap-3 overflow-hidden rounded-xl p-2 ring-1">
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg sm:w-40">
                  <Image
                    src={info.thumbnailUrl}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 py-1 pr-1">
                  <p className="line-clamp-2 font-medium text-pretty">{info.title}</p>
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {info.author}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline">{formatDuration(info.durationSeconds)}</Badge>
                    {info.viewCount > 0 ? (
                      <Badge variant="outline">{formatViews(info.viewCount)} views</Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {info ? (
            <div className="animate-in fade-in slide-in-from-bottom-3 grid gap-4 delay-75 duration-500">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Format</Label>
                <div className="bg-muted/60 grid grid-cols-2 gap-1 rounded-xl p-1">
                  <FormatButton
                    active={format === "mp4"}
                    onClick={() => setFormat("mp4")}
                    icon={<FilmIcon className="size-4" />}
                    label="MP4"
                    hint="Keep the video"
                  />
                  <FormatButton
                    active={format === "gif"}
                    disabled={ffmpegStatus === "unavailable"}
                    onClick={() => setFormat("gif")}
                    icon={<ImageIcon className="size-4" />}
                    label="GIF"
                    hint="Loop the moment"
                  />
                </div>
              </div>

              <div
                hidden={ffmpegStatus === "unavailable"}
                className={cn(
                  "grid grid-cols-2 gap-3",
                  ffmpegStatus === "loading" && "pointer-events-none opacity-50",
                )}
              >
                <TimeField
                  id="start"
                  label="Start range"
                  value={start}
                  placeholder="0:05"
                  maxHint={info ? formatDuration(info.durationSeconds) : undefined}
                  onChange={setStart}
                />
                <TimeField
                  id="end"
                  label="End range"
                  value={end}
                  placeholder="0:15"
                  maxHint={info ? formatDuration(info.durationSeconds) : undefined}
                  onChange={setEnd}
                />
              </div>

              {gifNeedsClip ? (
                <p className="text-muted-foreground animate-in fade-in text-xs duration-300">
                  Long GIFs get chunky. Clip a few seconds for a snappier loop.
                </p>
              ) : null}
            </div>
          ) : null}

          {busy || job === "done" ? (
            <div className="animate-in fade-in duration-300">
              <Progress value={progress} className="gap-2">
                <div className="flex w-full items-center gap-2">
                  <ProgressLabel>{statusLabel}</ProgressLabel>
                  <ProgressValue />
                </div>
              </Progress>
              {progressHint ? (
                <p className="text-muted-foreground mt-2 text-xs">{progressHint}</p>
              ) : null}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={busy || (Boolean(info) && needsFfmpeg && ffmpegStatus !== "ready")}
            className="h-11 w-full text-sm font-semibold"
          >
            {busy ? (
              <Loader2Icon className="animate-spin" />
            ) : job === "done" ? (
              <CheckIcon />
            ) : (
              <ScissorsIcon />
            )}
            {busy ? "Working…" : ctaLabel}
          </Button>
        </form>

        {result ? (
          <div className="animate-in fade-in zoom-in-95 mt-5 space-y-3 duration-500">
            <div className="bg-muted/40 overflow-hidden rounded-xl ring-1 ring-foreground/10">
              {result.type === "gif" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Converted GIF preview" className="w-full" />
              ) : (
                <video
                  src={result.url}
                  controls
                  className="w-full bg-black"
                />
              )}
            </div>
            <Button
              variant="outline"
              className="w-full"
              nativeButton={false}
              render={<a href={result.url} download={result.filename} />}
            >
              <DownloadIcon />
              Save {result.filename}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function FormatButton({
  active,
  disabled,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-all",
        active
          ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
          : "text-muted-foreground hover:text-foreground",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <span className={cn("size-4", active && "text-primary")}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-[11px] opacity-70">{hint}</span>
      </span>
    </button>
  );
}

function TimeField({
  id,
  label,
  value,
  placeholder,
  maxHint,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  maxHint?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <ClockIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
        <Input
          id={id}
          name={id}
          value={value}
          placeholder={placeholder}
          pattern={TIME_PATTERN}
          title="Use [HH:]MM:SS"
          onChange={(event) => onChange(event.target.value)}
          className="h-10 bg-background/70 pl-9"
        />
      </div>
      {maxHint ? (
        <p className="text-muted-foreground text-[11px]">Up to {maxHint}</p>
      ) : null}
    </div>
  );
}

function FfmpegBadge({ status }: { status: FfmpegStatus }) {
  if (status === "ready") {
    return (
      <Badge variant="secondary" className="shrink-0">
        Converter ready
      </Badge>
    );
  }

  if (status === "unavailable") {
    return (
      <Badge variant="outline" className="shrink-0">
        MP4 only
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="shrink-0">
      <Loader2Icon className="animate-spin" data-icon="inline-start" />
      Warming up
    </Badge>
  );
}

async function downloadVideoBytes(
  url: string,
  onProgress: (received: number) => void,
  signal: AbortSignal,
) {
  const response = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    signal,
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || contentType.includes("application/json")) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Could not download this video.");
  }

  if (!response.body) {
    throw new Error("The download stream was empty.");
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onProgress(received);
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return merged;
}

function triggerDownload(href: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

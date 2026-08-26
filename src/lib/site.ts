import type { Metadata } from "next";

export const SITE_URL = "https://snip-vid.com";
export const SITE_NAME = "Snip Vid";
export const SITE_TAGLINE = "Clip. Convert. Keep.";
export const SITE_TITLE =
  "Snip Vid — Clip a YouTube moment to MP4 or GIF in your browser";
export const SITE_DESCRIPTION =
  "Paste a YouTube link, trim the moment, and save an MP4 or GIF. Conversion stays on your machine — nothing is uploaded, no account, no watermark.";
export const SITE_OG_ALT =
  "Snip Vid — clip a YouTube moment to MP4 or GIF in your browser. Nothing is uploaded.";
export const SITE_KEYWORDS = [
  "clip YouTube moment",
  "YouTube to GIF",
  "YouTube clip to MP4",
  "trim YouTube clip",
  "browser GIF maker",
  "no upload video clipper",
];

export const SITE_PAGES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/how-it-works", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/youtube-to-gif", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/youtube-to-mp4", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.4 },
] as const;

export const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/youtube-to-gif", label: "GIF" },
  { href: "/youtube-to-mp4", label: "MP4" },
] as const;

export const FOOTER_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/youtube-to-gif", label: "YouTube to GIF" },
  { href: "/youtube-to-mp4", label: "YouTube to MP4" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function absoluteUrl(path: string) {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path}`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const branded = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title: branded,
      description,
      url: path,
    },
    twitter: {
      title: branded,
      description,
    },
  };
}

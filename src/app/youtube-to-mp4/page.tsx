import Link from "next/link";
import { ContentPage, SnipCta } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "YouTube to MP4",
  description:
    "Clip a YouTube moment to MP4 in your browser. Keep the audio, trim the range, save the file locally — no account, no watermark.",
  path: "/youtube-to-mp4",
  keywords: [
    "YouTube clip to MP4",
    "trim YouTube to MP4",
    "save YouTube moment as MP4",
    "YouTube clip with audio",
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/youtube-to-mp4#webpage`,
  url: `${SITE_URL}/youtube-to-mp4`,
  name: "YouTube to MP4 — Snip Vid",
  description: metadata.description,
  isPartOf: { "@id": `${SITE_URL}/#website` },
};

export default function YoutubeToMp4Page() {
  return (
    <ContentPage
      eyebrow="YouTube → MP4"
      title="Keep the audio. Save the MP4."
      lede="MP4 is the better default when the moment has words — a speech, a joke, a reaction. Paste the YouTube link, trim if you want, and save a file. Conversion stays on your machine."
    >
      <JsonLd data={jsonLd} />
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        How to snip an MP4
      </h2>
      <ol className="text-muted-foreground list-decimal space-y-2 pl-5">
        <li>Paste a public YouTube link into the snipper.</li>
        <li>Leave the format on MP4. Set a start and end if you only want a slice.</li>
        <li>Save the file. Trim happens in the browser; a full-range MP4 can pass through as-is.</li>
      </ol>
      <p className="text-muted-foreground">
        Need a silent loop instead?{" "}
        <Link href="/youtube-to-gif" className="text-foreground underline-offset-4 hover:underline">
          Make a GIF
        </Link>
        . Same paste-and-snip flow, different output.
      </p>
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        Why this is not a downloader farm
      </h2>
      <p className="text-muted-foreground">
        The job is the moment you already watched, not a warehouse of full
        videos. Snip Vid fetches the stream so your browser can clip it. There
        is no account, no watermark, and the finished MP4 is not uploaded
        anywhere.{" "}
        <Link href="/how-it-works" className="text-foreground underline-offset-4 hover:underline">
          See the pipeline
        </Link>
        .
      </p>
      <SnipCta>Snip an MP4</SnipCta>
    </ContentPage>
  );
}

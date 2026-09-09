import Link from "next/link";
import { ContentPage, SnipCta } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "YouTube to GIF",
  description:
    "Turn a YouTube moment into a GIF in your browser. Paste the link, trim the range, save a loop — converted locally, no watermark, no account.",
  path: "/youtube-to-gif",
  keywords: [
    "YouTube to GIF",
    "YouTube clip to GIF",
    "make a GIF from YouTube",
    "no watermark GIF",
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/youtube-to-gif#webpage`,
  url: `${SITE_URL}/youtube-to-gif`,
  name: "YouTube to GIF — Snip Vid",
  description: metadata.description,
  isPartOf: { "@id": `${SITE_URL}/#website` },
};

export default function YoutubeToGifPage() {
  return (
    <ContentPage
      eyebrow="YouTube → GIF"
      title="Save the moment as a GIF"
      lede="You watched a beat you want to loop. Paste the YouTube URL, mark the start and end, and keep a GIF. Conversion stays in the browser — no watermark, no account."
    >
      <JsonLd data={jsonLd} />
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        How to snip a GIF
      </h2>
      <ol className="text-muted-foreground list-decimal space-y-2 pl-5">
        <li>Paste a public YouTube link into the snipper.</li>
        <li>Pick GIF and set a short start and end range.</li>
        <li>Save the loop. The file is made on your machine.</li>
      </ol>
      <p className="text-muted-foreground">
        GIFs get heavy fast. A few seconds usually looks better and stays
        shareable. If you need the audio — a line, a speech, a punchline —{" "}
        <Link href="/youtube-to-mp4" className="text-foreground underline-offset-4 hover:underline">
          clip it to MP4
        </Link>{" "}
        instead.
      </p>
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        Local, free, no watermark
      </h2>
      <p className="text-muted-foreground">
        Snip Vid is not a pile of &ldquo;download any YouTube video&rdquo;
        ads. It is a browser clipper: the stream is fetched, then your range is
        turned into a GIF on the device in front of you. The finished file is
        not uploaded, and we do not stamp a logo on it.
      </p>
      <SnipCta>Snip a GIF</SnipCta>
    </ContentPage>
  );
}

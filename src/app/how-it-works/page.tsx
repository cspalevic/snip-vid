import Link from "next/link";
import { ContentPage, SnipCta } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "How it works",
  description:
    "Snip Vid fetches a YouTube stream, then trims and converts the clip in your browser with ffmpeg.wasm. No account, no watermark, nothing uploaded back.",
  path: "/how-it-works",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${SITE_URL}/how-it-works#howto`,
  name: "Clip a YouTube moment with Snip Vid",
  description: metadata.description,
  url: `${SITE_URL}/how-it-works`,
  totalTime: "PT2M",
  step: [
    {
      "@type": "HowToStep",
      name: "Paste the URL",
      text: "Drop a public YouTube link into Snip Vid.",
    },
    {
      "@type": "HowToStep",
      name: "Trim the moment",
      text: "Set a start and end if you only want a slice, then pick MP4 or GIF.",
    },
    {
      "@type": "HowToStep",
      name: "Convert locally",
      text: "Your browser receives the stream and converts the clip on your machine. Save the file.",
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <ContentPage
      eyebrow="Behind the snip"
      title="The file is made on your machine"
      lede="Paste a link, cut the moment, keep the file. The interesting part is where the conversion happens: after the stream reaches your browser, it does not go back out."
    >
      <JsonLd data={jsonLd} />
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        The path a clip takes
      </h2>
      <ol className="text-muted-foreground list-decimal space-y-3 pl-5">
        <li>
          You paste a YouTube URL. Snip Vid looks up the title, duration, and
          thumbnail so you can confirm you grabbed the right video.
        </li>
        <li>
          A small API on this site fetches the stream from YouTube and pipes it
          to your browser. That hop exists because YouTube will not hand the
          file to a webpage directly.
        </li>
        <li>
          If you picked a range or GIF, ffmpeg.wasm — a copy of ffmpeg running
          in WebAssembly — trims and converts the bytes in the tab. A full-range
          MP4 can skip that step and save as-is.
        </li>
        <li>
          You download a local file. The finished MP4 or GIF is never uploaded
          to Snip Vid.
        </li>
      </ol>
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        The technical bit
      </h2>
      <p className="text-muted-foreground">
        Video lookup and the stream itself go through YouTube.js on the server.
        Conversion uses ffmpeg.wasm in the browser. That split is why we can say
        the clip is processed locally without pretending the original stream
        never touches our Worker. For what is logged, see{" "}
        <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
          privacy
        </Link>
        .
      </p>
      <p className="text-muted-foreground">
        GIF conversion loves short ranges. Longer loops get chunky; a few
        seconds is usually the sweet spot.
      </p>
      <SnipCta>Open the snipper</SnipCta>
    </ContentPage>
  );
}

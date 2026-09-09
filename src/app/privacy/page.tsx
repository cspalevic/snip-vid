import { ContentPage, SnipCta } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Snip Vid handles YouTube URLs, streams, and local conversion. No account, no stored clips, and an honest note about host request logs.",
  path: "/privacy",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/privacy#webpage`,
  url: `${SITE_URL}/privacy`,
  name: "Privacy — Snip Vid",
  description: metadata.description,
  isPartOf: { "@id": `${SITE_URL}/#website` },
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="What happens to your clip"
      lede="Short version: we help your browser fetch a YouTube stream, you convert it locally, and we never get the finished file. Here is the honest version."
    >
      <JsonLd data={jsonLd} />
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        When you snip
      </h2>
      <p className="text-muted-foreground">
        You paste a YouTube URL. The page asks this site&apos;s{" "}
        <code className="text-foreground text-[0.85em]">/api/info</code> and{" "}
        <code className="text-foreground text-[0.85em]">/api/download</code>{" "}
        routes to look the video up and stream the bytes to your browser.
        YouTube does not let a random webpage pull that file directly, so the
        request goes through our Cloudflare Worker. The bytes are piped through
        — we do not keep a copy of the video or of the MP4/GIF you save.
      </p>
      <p className="text-muted-foreground">
        Trim and convert run in your browser. The finished file is created on
        your machine and downloaded from a local blob. It is not uploaded back
        to Snip Vid.
      </p>
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        What we don&apos;t do
      </h2>
      <ul className="text-muted-foreground list-disc space-y-2 pl-5">
        <li>No accounts, logins, or profiles.</li>
        <li>No advertising or analytics scripts on the page.</li>
        <li>No watermark on the file you keep.</li>
        <li>No library of clips stored on our servers.</li>
      </ul>
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        What may be logged
      </h2>
      <p className="text-muted-foreground">
        This site runs on Cloudflare. Standard host request logs can include an
        IP address, timestamps, and the API calls that carry the YouTube URL you
        pasted. Those logs are for running the service, not a clip archive. We
        do not sell that data, and we are not claiming &ldquo;we log
        nothing.&rdquo;
      </p>
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        Questions
      </h2>
      <p className="text-muted-foreground">
        Snip Vid is built by Charlie Spalevic. The code lives on{" "}
        <a
          href="https://github.com/cspalevic/snip-vid"
          className="text-foreground underline-offset-4 hover:underline"
        >
          GitHub
        </a>
        .
      </p>
      <SnipCta>Back to the snipper</SnipCta>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { SnipStudio } from "@/components/snip-studio";
import { HOME_FAQS } from "@/lib/faq";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <SiteShell>
      <JsonLd />
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 mb-8 max-w-xl text-center duration-700">
          <p className="text-primary mb-3 text-xs font-medium tracking-[0.22em] uppercase">
            Free · Local · No account
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Cut the moment. Keep the file.
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-pretty">
            Paste a YouTube link, trim the beat you actually want, and save an
            MP4 or GIF. The clip is converted on your machine — nothing is
            uploaded, no watermark.
          </p>
        </div>
        <SnipStudio />
        <section className="mt-16 w-full max-w-xl space-y-8 text-sm leading-7">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              A clipper, not a dumping ground
            </h2>
            <p className="text-muted-foreground mt-3 text-pretty">
              Snip Vid is for the job &ldquo;I watched a moment on YouTube and I
              want the file.&rdquo; It is free. It does not need an account. You
              can walk away with an{" "}
              <Link href="/youtube-to-mp4" className="text-foreground underline-offset-4 hover:underline">
                MP4
              </Link>{" "}
              that keeps the audio, or a looping{" "}
              <Link href="/youtube-to-gif" className="text-foreground underline-offset-4 hover:underline">
                GIF
              </Link>
              . Trim and convert happen in the browser after the stream is
              fetched — the finished file never leaves your machine.{" "}
              <Link href="/how-it-works" className="text-foreground underline-offset-4 hover:underline">
                How it works
              </Link>
              .
            </p>
          </div>
          <div id="faq">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Quick answers
            </h2>
            <dl className="mt-4 space-y-5">
              {HOME_FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-medium">{faq.question}</dt>
                  <dd className="text-muted-foreground mt-1 text-pretty">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

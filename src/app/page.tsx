import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { SnipStudio } from "@/components/snip-studio";

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden">
      <JsonLd />
      <AnimatedBackdrop />
      <SiteHeader />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 mb-8 max-w-xl text-center duration-700">
          <p className="text-primary mb-3 text-xs font-medium tracking-[0.22em] uppercase">
            Browser-native snipping
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Cut the moment. Keep the file.
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-pretty">
            YouTube.js fetches the stream. ffmpeg.wasm trims and converts it on
            your machine — no upload, no waiting on a render farm.
          </p>
        </div>
        <SnipStudio />
      </main>
      <footer className="text-muted-foreground relative z-10 px-4 py-6 text-center text-xs">
        Clips are processed locally after download. GIF conversion loves short
        ranges.
      </footer>
    </div>
  );
}

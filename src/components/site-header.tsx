import Image from "next/image";
import { SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt="Snip Vid"
          width={40}
          height={40}
          className="shadow-primary/30 size-10 rounded-2xl shadow-lg transition-transform duration-500 hover:-rotate-12 hover:scale-105"
          priority
          unoptimized
        />
        <div className="leading-tight">
          <p className="font-heading text-lg font-semibold tracking-tight">
            Snip Vid
          </p>
          <p className="text-muted-foreground text-xs">Clip. Convert. Keep.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          <SparklesIcon data-icon="inline-start" />
          ffmpeg.wasm
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}

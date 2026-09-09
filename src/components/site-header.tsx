import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt={SITE_NAME}
          width={40}
          height={40}
          className="shadow-primary/30 size-10 rounded-2xl shadow-lg transition-transform duration-500 hover:-rotate-12 hover:scale-105"
          priority
          unoptimized
        />
        <div className="leading-tight">
          <p className="font-heading text-lg font-semibold tracking-tight">
            {SITE_NAME}
          </p>
          <p className="text-muted-foreground text-xs">{SITE_TAGLINE}</p>
        </div>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <nav
          aria-label="Primary"
          className="text-muted-foreground hidden items-center gap-4 text-sm md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          No upload
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}

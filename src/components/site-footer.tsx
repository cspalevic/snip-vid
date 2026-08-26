import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="text-muted-foreground relative z-10 px-4 py-8 text-center text-xs">
      <p>Clips are converted on your machine. GIF conversion loves short ranges.</p>
      <nav
        aria-label="Site"
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      >
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}

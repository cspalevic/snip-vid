import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContentPage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {eyebrow ? (
          <p className="text-primary mb-3 text-xs font-medium tracking-[0.22em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {lede ? (
          <p className="text-muted-foreground mt-4 text-lg text-pretty">{lede}</p>
        ) : null}
        <div className="mt-8 space-y-5 text-[0.95rem] leading-7">{children}</div>
      </main>
    </SiteShell>
  );
}

export function SnipCta({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-2">
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "no-underline")}>
        {children}
      </Link>
    </p>
  );
}

import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden">
      <AnimatedBackdrop />
      <SiteHeader />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}

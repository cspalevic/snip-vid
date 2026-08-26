export function AnimatedBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="bg-primary/25 animate-orb-a absolute -top-24 left-[12%] size-[28rem] rounded-full blur-3xl" />
      <div className="bg-chart-2/20 animate-orb-b absolute top-[30%] -right-24 size-[32rem] rounded-full blur-3xl" />
      <div className="bg-chart-3/15 animate-orb-c absolute -bottom-32 left-[30%] size-[24rem] rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_18%,transparent_72%)]" />
      <div className="bg-grain absolute inset-0 opacity-[0.045] mix-blend-overlay" />
    </div>
  );
}

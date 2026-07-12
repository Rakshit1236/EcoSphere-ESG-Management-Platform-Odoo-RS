function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

export function Chip({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "sage" | "gold" | "muted" | "amber" | "blue" | "lavender" }) {
  const t = {
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    sage: "bg-[#8ab5a0]/15 text-[#8ab5a0] border-[#8ab5a0]/25",
    gold: "bg-[#c8a96e]/15 text-[#c8a96e] border-[#c8a96e]/25",
    muted: "bg-white/[0.06] text-white/40 border-white/10",
    amber: "bg-amber-400/15 text-amber-400 border-amber-400/25",
    blue: "bg-sky-400/15 text-sky-400 border-sky-400/25",
    lavender: "bg-purple-400/15 text-purple-300 border-purple-400/25",
  }[tone];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 text-[10px] font-sans font-medium tracking-widest uppercase rounded border", t)}>
      {children}
    </span>
  );
}

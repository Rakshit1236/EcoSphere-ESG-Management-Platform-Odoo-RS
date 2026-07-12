export function PageHdr({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (
    <div className="pt-1 mb-8">
      <p className="text-[10px] font-sans text-primary tracking-[0.35em] uppercase mb-3">{tag}</p>
      <h1 className="font-display font-normal text-foreground" style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}>{title}</h1>
      {sub && <p className="text-sm font-sans text-muted-foreground font-light mt-2">{sub}</p>}
    </div>
  );
}

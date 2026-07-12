import { GlassCard } from "./glass-card";

export function Panel({ title, sub, action, children }: {
  title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <GlassCard dark hover={false} className="p-6 border border-white/[0.07]">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-sans font-medium text-sm text-foreground tracking-wide">{title}</h3>
          {sub && <p className="text-xs font-sans text-muted-foreground font-light mt-0.5">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </GlassCard>
  );
}

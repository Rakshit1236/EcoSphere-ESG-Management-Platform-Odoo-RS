"use client";

import { motion } from "motion/react";
import { GlassCard } from "./glass-card";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

export function KPICard({ label, value, change, up, icon, sub, delay = 0 }: {
  label: string; value: string; change?: string; up?: boolean; icon: React.ReactNode; sub?: string; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: "easeOut" }}>
      <GlassCard dark hover className="p-6 group h-full border border-white/[0.07]">
        <div className="flex items-start justify-between mb-5">
          <div className="text-muted-foreground/45 group-hover:text-primary transition-colors duration-300">{icon}</div>
          {change && (
            <span className={cn("text-xs font-sans flex items-center gap-1 font-light", up ? "text-primary" : "text-amber-400")}>
              {up ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}{change}
            </span>
          )}
        </div>
        <p className="font-display text-2xl font-normal text-foreground mb-1 tracking-tight">{value}</p>
        <p className="text-xs font-sans text-muted-foreground font-light">{label}</p>
        {sub && <p className="text-[10px] font-sans text-muted-foreground/40 mt-1 font-light">{sub}</p>}
      </GlassCard>
    </motion.div>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
    </svg>
  );
}

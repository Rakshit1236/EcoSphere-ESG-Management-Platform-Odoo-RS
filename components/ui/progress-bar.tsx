"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

export function ProgressBar({ value, label, note, color = "bg-primary" }: {
  value: number; label?: string; note?: string; color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref}>
      {label && (
        <div className="flex justify-between text-xs font-sans mb-1.5">
          <span className="text-muted-foreground font-light">{label}{note ? ` · ${note}` : ""}</span>
          <span className="text-foreground">{value}%</span>
        </div>
      )}
      <div className="h-0.5 bg-border overflow-hidden rounded-full">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          className={cn("h-full rounded-full", color)} />
      </div>
    </div>
  );
}

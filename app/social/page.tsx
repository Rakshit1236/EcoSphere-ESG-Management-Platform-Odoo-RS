"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Users, Heart, UserCheck, DollarSign } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Panel } from "@/components/ui/panel";
import { PageHdr } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Chip } from "@/components/ui/chip";

export default function SocialPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <AppShell>
      <div className="space-y-7">
        <PageHdr tag="ESG Pillar" title="Social." sub="CSR programs, employee wellbeing, and community impact" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Social Score", v: "88.1", ch: "+2.6pts", up: true, I: Users, s: "vs Q3 2024" },
            { l: "Satisfaction", v: "4.3/5.0", ch: "+0.2", up: true, I: Heart, s: "Annual survey" },
            { l: "Volunteer Hours", v: "14,820", ch: "+22%", up: true, I: UserCheck, s: "YTD 2024" },
            { l: "Community Investment", v: "$2.4M", ch: "+8%", up: true, I: DollarSign, s: "Direct + in-kind" },
          ].map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white/[0.035] backdrop-blur-xl border border-white/[0.07] shadow-2xl rounded-lg p-6 group h-full">
              <div className="flex items-start justify-between mb-5">
                <div className="text-muted-foreground/45 group-hover:text-primary transition-colors duration-300"><k.I className="w-4 h-4" /></div>
                <span className="text-xs font-sans flex items-center gap-1 font-light text-primary">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>{k.ch}
                </span>
              </div>
              <p className="font-display text-2xl font-normal text-foreground mb-1 tracking-tight">{k.v}</p>
              <p className="text-xs font-sans text-muted-foreground font-light">{k.l}</p>
              <p className="text-[10px] font-sans text-muted-foreground/40 mt-1 font-light">{k.s}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="DEI Metrics" sub="Diversity, equity & inclusion">
            <div className="space-y-5">
              {[
                { l: "Gender Diversity", v: 58, n: "58% female across all levels", c: "bg-primary" },
                { l: "Pay Equity", v: 97, n: "3% gap — active remediation", c: "bg-[#8ab5a0]" },
                { l: "Inclusive Leadership", v: 84, n: "Managerial DEI training", c: "bg-[#5b8a9a]" },
                { l: "Cultural Diversity", v: 72, n: "34 nationalities", c: "bg-[#9b8bb4]" },
              ].map(d => (
                <ProgressBar key={d.l} label={d.l} note={d.n} value={d.v} color={d.c} />
              ))}
            </div>
          </Panel>

          <Panel title="CSR Programs" sub="Active initiatives">
            <div className="space-y-0">
              {[
                { n: "Zero Waste Workplace", cat: "Environment", pct: 76, active: true },
                { n: "Employee Wellness Month", cat: "Wellbeing", pct: 62, active: true },
                { n: "Community Tree Planting", cat: "Community", pct: 100, active: false },
                { n: "STEM Education Initiative", cat: "Education", pct: 45, active: true },
                { n: "Local Food Bank Partnership", cat: "Community", pct: 88, active: true },
              ].map(p => (
                <div key={p.n} className="flex items-center justify-between py-3.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-sans font-light text-foreground">{p.n}</p>
                    <p className="text-[10px] font-sans text-muted-foreground mt-0.5">{p.cat}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-sans text-foreground">{p.pct}%</span>
                    <Chip tone={p.active ? "green" : "sage"}>{p.active ? "active" : "done"}</Chip>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

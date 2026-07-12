"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Zap, Trophy, Award, Target, TrendingUp, TrendingDown, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PageHdr } from "@/components/ui/page-header";
import { Chip } from "@/components/ui/chip";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

const leaderboard = [
  { rank: 1, name: "Sarah Chen", dept: "HR", xp: 4820, badges: 12, trend: "up" },
  { rank: 2, name: "Marcus Webb", dept: "Engineering", xp: 4640, badges: 11, trend: "up" },
  { rank: 3, name: "Priya Nair", dept: "Product", xp: 4510, badges: 10, trend: "same" },
  { rank: 4, name: "James Okafor", dept: "Sales", xp: 4290, badges: 9, trend: "down" },
  { rank: 5, name: "Aisha Tanaka", dept: "Finance", xp: 4180, badges: 9, trend: "up" },
  { rank: 6, name: "Liam Torres", dept: "Operations", xp: 3960, badges: 8, trend: "down" },
  { rank: 7, name: "Elena Volkov", dept: "Engineering", xp: 3820, badges: 8, trend: "up" },
  { rank: 8, name: "Noah Baptiste", dept: "Product", xp: 3710, badges: 7, trend: "same" },
];

function KPICard({ label, value, change, up, icon, sub, delay = 0 }: {
  label: string; value: string; change?: string; up?: boolean; icon: React.ReactNode; sub?: string; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="bg-white/[0.035] backdrop-blur-xl border border-white/[0.07] shadow-2xl rounded-lg p-6 group h-full">
      <div className="flex items-start justify-between mb-5">
        <div className="text-muted-foreground/45 group-hover:text-primary transition-colors duration-300">{icon}</div>
        {change && (
          <span className={cn("text-xs font-sans flex items-center gap-1 font-light", up ? "text-primary" : "text-amber-400")}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{change}
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-normal text-foreground mb-1 tracking-tight">{value}</p>
      <p className="text-xs font-sans text-muted-foreground font-light">{label}</p>
      {sub && <p className="text-[10px] font-sans text-muted-foreground/40 mt-1 font-light">{sub}</p>}
    </motion.div>
  );
}

export default function GamificationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  const kpis = [
    { label: "Your XP", value: "4,820", change: "+340 this week", up: true, icon: <Zap className="w-4.5 h-4.5" />, sub: "Level 18" },
    { label: "Global Rank", value: "#1", change: "Top performer", up: true, icon: <Trophy className="w-4.5 h-4.5" />, sub: "Q4 2024" },
    { label: "Badges Earned", value: "12", change: "+4 this month", up: true, icon: <Award className="w-4.5 h-4.5" />, sub: "of 18 total" },
    { label: "Challenges Done", value: "28", change: "3 active", up: true, icon: <Target className="w-4.5 h-4.5" />, sub: "YTD 2024" },
  ];

  return (
    <AppShell>
      <div className="space-y-7">
        <PageHdr tag="Engagement" title="Gamification." sub="Challenges, badges, XP, and sustainability leaderboard" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k, i) => <KPICard key={k.label} {...k} delay={i * 0.08} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="Leaderboard" sub="Q4 2024 ranking">
            <div className="space-y-0">
              {leaderboard.map(u => (
                <div key={u.rank} className="flex items-center gap-4 py-3.5 border-b border-border/50 last:border-0 hover:bg-muted/10 -mx-2 px-2 rounded-lg transition-colors">
                  <span className={cn("text-sm font-sans w-6 flex-shrink-0 text-center", u.rank <= 3 ? "text-primary font-medium" : "text-muted-foreground/25")}>
                    {u.rank <= 3 ? `0${u.rank}` : u.rank}
                  </span>
                  <div className="w-7 h-7 bg-muted/50 border border-border rounded-full flex items-center justify-center text-[10px] font-sans text-muted-foreground flex-shrink-0">
                    {u.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-sans font-light text-foreground">{u.name}</p>
                    <p className="text-[10px] font-sans text-muted-foreground">{u.dept}</p>
                  </div>
                  <p className="text-sm font-sans text-foreground flex-shrink-0">{u.xp.toLocaleString()}</p>
                  {u.trend === "up" ? <TrendingUp className="w-3 h-3 text-primary flex-shrink-0" /> : u.trend === "down" ? <TrendingDown className="w-3 h-3 text-amber-400 flex-shrink-0" /> : <span className="w-3 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="XP Progress" sub="Level 18 → 19">
              <div className="mb-3"><ProgressBar value={96} label="4,820 / 5,000 XP" color="bg-primary" /></div>
              <p className="text-xs font-sans text-muted-foreground font-light">180 XP to next level</p>
            </Panel>

            <Panel title="Badge Collection">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: "Green Champion", e: "🌱", earned: true },
                  { n: "Zero Waste", e: "♻️", earned: true },
                  { n: "Solar Pioneer", e: "☀️", earned: true },
                  { n: "CSR Leader", e: "🤝", earned: true },
                  { n: "Carbon Cutter", e: "✂️", earned: false },
                  { n: "Policy Guardian", e: "🛡️", earned: false },
                ].map(b => (
                  <motion.div key={b.n} whileHover={b.earned ? { scale: 1.08 } : undefined}
                    className={cn("p-3 border rounded-xl text-center transition-all cursor-default", b.earned ? "border-primary/25 bg-primary/[0.08]" : "border-border opacity-30")}>
                    <div className="text-xl mb-1.5">{b.e}</div>
                    <p className="text-[9px] font-sans text-foreground/80 leading-tight">{b.n}</p>
                  </motion.div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

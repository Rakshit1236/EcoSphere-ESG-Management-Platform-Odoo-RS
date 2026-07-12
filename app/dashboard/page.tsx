"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Globe, Leaf, Zap, Shield, Heart, Users, Download, ArrowUp, ArrowDown } from "lucide-react";
import AppShell from "@/components/AppShell";
import { GlassCard } from "@/components/ui/glass-card";
import { ScoreRing } from "@/components/ui/score-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Panel } from "@/components/ui/panel";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

const carbonData = [
  { month: "Jan", s1: 1420, s2: 980, s3: 2340 },
  { month: "Feb", s1: 1380, s2: 920, s3: 2180 },
  { month: "Mar", s1: 1290, s2: 880, s3: 2050 },
  { month: "Apr", s1: 1310, s2: 840, s3: 1980 },
  { month: "May", s1: 1260, s2: 810, s3: 1920 },
  { month: "Jun", s1: 1190, s2: 790, s3: 1840 },
  { month: "Jul", s1: 1140, s2: 760, s3: 1780 },
  { month: "Aug", s1: 1080, s2: 730, s3: 1710 },
  { month: "Sep", s1: 1050, s2: 710, s3: 1680 },
  { month: "Oct", s1: 1020, s2: 690, s3: 1640 },
  { month: "Nov", s1: 980, s2: 660, s3: 1590 },
  { month: "Dec", s1: 940, s2: 640, s3: 1540 },
];

const trendData = [
  { q: "Q1'23", e: 68, s: 72, g: 75, t: 71 },
  { q: "Q2'23", e: 71, s: 74, g: 76, t: 73 },
  { q: "Q3'23", e: 73, s: 76, g: 78, t: 75 },
  { q: "Q4'23", e: 76, s: 79, g: 80, t: 78 },
  { q: "Q1'24", e: 79, s: 81, g: 82, t: 80 },
  { q: "Q2'24", e: 82, s: 84, g: 84, t: 83 },
  { q: "Q3'24", e: 84, s: 86, g: 86, t: 85 },
  { q: "Q4'24", e: 87, s: 88, g: 91, t: 87 },
];

const complianceData = [
  { name: "Compliant", value: 78, color: "#56b874" },
  { name: "In Progress", value: 14, color: "#8ab5a0" },
  { name: "At Risk", value: 5, color: "#c8a96e" },
  { name: "Exempt", value: 3, color: "#253825" },
];

const activity = [
  { id: 1, user: "Sarah Chen", action: "completed Carbon Audit Q4 2024", time: "2m ago", type: "audit" },
  { id: 2, user: "AI System", action: "flagged Scope 3 anomaly in Supply Chain", time: "18m ago", type: "alert" },
  { id: 3, user: "Marcus Webb", action: "submitted renewable energy report Nov–Dec", time: "1h ago", type: "report" },
  { id: 4, user: "HR Team", action: "launched Q1 2025 Employee Wellness Challenge", time: "3h ago", type: "challenge" },
  { id: 5, user: "Priya Nair", action: "updated Board Diversity policy document", time: "5h ago", type: "policy" },
];

const TT = {
  background: "rgba(12,20,10,0.96)", border: "1px solid rgba(86,184,116,0.15)",
  borderRadius: "6px", color: "#eeeae0", fontSize: "11px", fontFamily: "'Jost',sans-serif",
};
const AX = { fontSize: 10, fill: "#7a9280", fontFamily: "'Jost',sans-serif" };

function KPICard({ label, value, change, up, icon, sub, delay = 0 }: {
  label: string; value: string; change?: string; up?: boolean; icon: React.ReactNode; sub?: string; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: "easeOut" }}>
      <GlassCard dark hover className="p-6 group h-full border border-white/[0.07]">
        <div className="flex items-start justify-between mb-5">
          <div className="text-muted-foreground/45 group-hover:text-primary transition-colors duration-300">{icon}</div>
          {change && (
            <span className={cn("text-xs font-sans flex items-center gap-1 font-light", up ? "text-primary" : "text-amber-400")}>
              {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{change}
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

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  const kpis = [
    { label: "ESG Total Score", value: "87.4", change: "+3.2pts", up: true, icon: <Globe className="w-4.5 h-4.5" />, sub: "Top 12% industry" },
    { label: "Carbon Footprint", value: "3,124 tCO₂", change: "−18.4%", up: true, icon: <Leaf className="w-4.5 h-4.5" />, sub: "vs Q3 2024" },
    { label: "Renewable Energy", value: "68.2%", change: "+4.1%", up: true, icon: <Zap className="w-4.5 h-4.5" />, sub: "Target 75% by 2025" },
    { label: "Compliance Rate", value: "94.2%", change: "+1.8%", up: true, icon: <Shield className="w-4.5 h-4.5" />, sub: "78 of 83 controls" },
    { label: "CSR Participants", value: "2,847", change: "+12%", up: true, icon: <Heart className="w-4.5 h-4.5" />, sub: "Employees engaged" },
    { label: "Social Score", value: "88.1", change: "+2.6pts", up: true, icon: <Users className="w-4.5 h-4.5" />, sub: "Employee wellbeing" },
  ];

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="text-[10px] font-sans text-primary tracking-[0.35em] uppercase mb-2">Overview</p>
            <h1 className="font-display font-light text-foreground" style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}>Good morning, {session.user?.name?.split(" ")[0] || "User"}.</h1>
            <p className="text-sm font-sans text-muted-foreground font-light mt-1.5">ESG performance — Q4 2024</p>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-4 py-2 border border-border text-xs font-sans text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all rounded-md">
              <Download className="w-3.5 h-3.5" />Export
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md hover:bg-primary/90 transition-colors shadow-md shadow-primary/15">
              <Zap className="w-3.5 h-3.5" />Refresh
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {kpis.map((k, i) => <KPICard key={k.label} {...k} delay={i * 0.06} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel title="ESG Score" sub="Overall composite">
            <div className="flex items-center gap-5">
              <ScoreRing score={87} size={110} />
              <div className="flex-1 space-y-3.5">
                {[
                  { l: "Environmental", v: 84, c: "bg-primary" },
                  { l: "Social", v: 88, c: "bg-[#8ab5a0]" },
                  { l: "Governance", v: 91, c: "bg-[#c8a96e]" },
                ].map(p => (
                  <ProgressBar key={p.l} label={p.l} value={p.v} color={p.c} />
                ))}
              </div>
            </div>
          </Panel>
          <div className="lg:col-span-2">
            <Panel title="Carbon Emissions" sub="Monthly tCO₂e — Scope 1, 2 & 3">
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={carbonData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    {[["cg1", "#56b874"], ["cg2", "#8ab5a0"]].map(([id, c]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(238,234,224,0.04)" />
                  <XAxis dataKey="month" tick={AX} axisLine={false} tickLine={false} />
                  <YAxis tick={AX} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TT} />
                  <Area type="monotone" dataKey="s1" name="Scope 1" stroke="#56b874" fill="url(#cg1)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="s3" name="Scope 3" stroke="#8ab5a0" fill="url(#cg2)" strokeWidth={1.5} />
                  <Legend iconType="square" iconSize={6} wrapperStyle={{ fontSize: "10px", color: "#7a9280", fontFamily: "'Jost'" }} />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="ESG Score Trend" sub="8 quarters">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(238,234,224,0.04)" />
                <XAxis dataKey="q" tick={AX} axisLine={false} tickLine={false} />
                <YAxis domain={[65, 95]} tick={AX} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Line type="monotone" dataKey="t" name="Total" stroke="#56b874" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="e" name="Environmental" stroke="#8ab5a0" strokeWidth={1.2} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="s" name="Social" stroke="#5b8a9a" strokeWidth={1.2} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="g" name="Governance" stroke="#c8a96e" strokeWidth={1.2} dot={false} strokeDasharray="4 2" />
                <Legend iconType="square" iconSize={6} wrapperStyle={{ fontSize: "10px", color: "#7a9280", fontFamily: "'Jost'" }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="Compliance" sub="Controls status breakdown">
            <div className="flex items-center gap-6">
              <div style={{ width: 130, height: 130, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={complianceData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {complianceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={TT} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {complianceData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-[11px] font-sans text-muted-foreground font-light">{d.name}</span>
                    </div>
                    <span className="text-xs font-sans text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Recent Activity" sub="Live ESG platform events">
          <div className="space-y-0">
            {activity.map(a => (
              <div key={a.id} className="flex items-start gap-4 py-4 border-b border-border/50 last:border-0 hover:bg-muted/10 -mx-2 px-2 rounded-lg transition-colors">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-sans text-foreground font-light leading-relaxed">
                    <span className="font-medium">{a.user}</span> {a.action}
                  </p>
                  <p className="text-[10px] font-sans text-muted-foreground/35 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

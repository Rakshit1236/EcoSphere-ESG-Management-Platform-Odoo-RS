"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Leaf, Download } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Panel } from "@/components/ui/panel";
import { PageHdr } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";

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

const TT = {
  background: "rgba(12,20,10,0.96)", border: "1px solid rgba(86,184,116,0.15)",
  borderRadius: "6px", color: "#eeeae0", fontSize: "11px", fontFamily: "'Jost',sans-serif",
};
const AX = { fontSize: 10, fill: "#7a9280", fontFamily: "'Jost',sans-serif" };

export default function EnvironmentalPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <AppShell>
      <div className="space-y-7">
        <PageHdr tag="ESG Pillar" title="Environmental." sub="Carbon tracking, energy, water, and sustainability goals" />

        <div className="grid grid-cols-3 gap-4">
          {[
            { l: "Scope 1", v: "940 tCO₂e", s: "Direct emissions" },
            { l: "Scope 2", v: "640 tCO₂e", s: "Purchased energy" },
            { l: "Scope 3", v: "1,544 tCO₂e", s: "Supply chain, travel" },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white/[0.035] backdrop-blur-xl border border-white/[0.07] shadow-2xl rounded-lg p-6 group h-full">
              <div className="flex items-start justify-between mb-5">
                <div className="text-muted-foreground/45 group-hover:text-primary transition-colors duration-300"><Leaf className="w-4 h-4" /></div>
              </div>
              <p className="font-display text-2xl font-normal text-foreground mb-1 tracking-tight">{s.v}</p>
              <p className="text-xs font-sans text-muted-foreground font-light">{s.l}</p>
              <p className="text-[10px] font-sans text-muted-foreground/40 mt-1 font-light">{s.s}</p>
            </motion.div>
          ))}
        </div>

        <Panel title="Carbon Emissions by Month" sub="Scope 1, 2 & 3 — tCO₂e"
          action={<button className="flex items-center gap-1.5 text-[10px] font-sans text-muted-foreground hover:text-foreground border border-border/50 px-2.5 py-1.5 rounded-md"><Download className="w-3 h-3" />Export</button>}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={carbonData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                {[["ea", "#56b874"], ["eb", "#8ab5a0"], ["ec", "#5b8a9a"]].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.2} /><stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(238,234,224,0.04)" />
              <XAxis dataKey="month" tick={AX} axisLine={false} tickLine={false} />
              <YAxis tick={AX} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Area type="monotone" dataKey="s1" name="Scope 1" stroke="#56b874" fill="url(#ea)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="s2" name="Scope 2" stroke="#8ab5a0" fill="url(#eb)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="s3" name="Scope 3" stroke="#5b8a9a" fill="url(#ec)" strokeWidth={1.5} />
              <Legend iconType="square" iconSize={6} wrapperStyle={{ fontSize: "10px", color: "#7a9280", fontFamily: "'Jost'" }} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Sustainability Goals" sub="Progress toward net-zero commitments">
          <div className="space-y-5">
            {[
              { l: "Carbon Neutrality", v: 62, n: "Net zero by 2035", c: "bg-primary" },
              { l: "Renewable Energy", v: 68, n: "100% by 2026", c: "bg-[#8ab5a0]" },
              { l: "Water Reduction", v: 81, n: "30% vs 2020", c: "bg-[#5b8a9a]" },
              { l: "Waste Diversion", v: 74, n: "Zero landfill by 2027", c: "bg-[#9b8bb4]" },
              { l: "Supplier Certification", v: 45, n: "100% certified by 2028", c: "bg-[#c8a96e]" },
            ].map(g => (
              <ProgressBar key={g.l} label={g.l} note={g.n} value={g.v} color={g.c} />
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

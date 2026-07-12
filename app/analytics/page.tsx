"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Shield } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Panel } from "@/components/ui/panel";
import { PageHdr } from "@/components/ui/page-header";

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

const deptData = [
  { dept: "HR", env: 85, social: 96, gov: 92 },
  { dept: "Product", env: 86, social: 90, gov: 88 },
  { dept: "Engineering", env: 82, social: 91, gov: 88 },
  { dept: "Finance", env: 80, social: 83, gov: 89 },
  { dept: "Sales", env: 79, social: 88, gov: 79 },
  { dept: "Operations", env: 71, social: 79, gov: 78 },
];

const carbonData = [
  { month: "Jan", s1: 1420 }, { month: "Feb", s1: 1380 }, { month: "Mar", s1: 1290 },
  { month: "Apr", s1: 1310 }, { month: "May", s1: 1260 }, { month: "Jun", s1: 1190 },
  { month: "Jul", s1: 1140 }, { month: "Aug", s1: 1080 }, { month: "Sep", s1: 1050 },
  { month: "Oct", s1: 1020 }, { month: "Nov", s1: 980 }, { month: "Dec", s1: 940 },
];

const complianceData = [
  { name: "Compliant", value: 78, color: "#56b874" },
  { name: "In Progress", value: 14, color: "#8ab5a0" },
  { name: "At Risk", value: 5, color: "#c8a96e" },
  { name: "Exempt", value: 3, color: "#253825" },
];

const TT = {
  background: "rgba(12,20,10,0.96)", border: "1px solid rgba(86,184,116,0.15)",
  borderRadius: "6px", color: "#eeeae0", fontSize: "11px", fontFamily: "'Jost',sans-serif",
};
const AX = { fontSize: 10, fill: "#7a9280", fontFamily: "'Jost',sans-serif" };

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  const role = (session?.user as any)?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-display text-2xl font-normal text-foreground mb-3">Access Restricted</h2>
            <p className="text-sm font-sans text-muted-foreground mb-8 leading-relaxed">
              Analytics is only available to Admin users. Your current role does not have access to this page.
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button onClick={() => router.push("/challenges")} whileHover={{ scale: 1.02 }}
                className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md hover:bg-primary/90">
                View Challenges
              </motion.button>
              <motion.button onClick={() => router.push("/gamification")} whileHover={{ scale: 1.02 }}
                className="px-5 py-2.5 border border-border text-xs font-sans text-muted-foreground hover:text-foreground rounded-md">
                Gamification Hub
              </motion.button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-7">
        <PageHdr tag="Intelligence" title="Analytics." sub="Deep-dive ESG analysis, trends, and benchmarking" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="ESG Score Trend" sub="8 quarters — all pillars">
            <ResponsiveContainer width="100%" height={220}>
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

          <Panel title="Department Comparison" sub="ESG by department">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(238,234,224,0.04)" />
                <XAxis dataKey="dept" tick={{ fontSize: 9, fill: "#7a9280", fontFamily: "'Jost'" }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={AX} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="env" name="Environmental" fill="#56b874" maxBarSize={10} radius={[3, 3, 0, 0]} />
                <Bar dataKey="social" name="Social" fill="#5b8a9a" maxBarSize={10} radius={[3, 3, 0, 0]} />
                <Bar dataKey="gov" name="Governance" fill="#c8a96e" maxBarSize={10} radius={[3, 3, 0, 0]} />
                <Legend iconType="square" iconSize={6} wrapperStyle={{ fontSize: "10px", color: "#7a9280", fontFamily: "'Jost'" }} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="Carbon Trend" sub="Monthly Scope 1 emissions">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={carbonData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="atg3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#56b874" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#56b874" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(238,234,224,0.04)" />
                <XAxis dataKey="month" tick={AX} axisLine={false} tickLine={false} />
                <YAxis tick={AX} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="s1" name="Scope 1" stroke="#56b874" fill="url(#atg3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Compliance Breakdown">
            <div className="flex items-center gap-8">
              <div style={{ width: 150, height: 150, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={complianceData} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {complianceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={TT} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3.5">
                {complianceData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs font-sans text-muted-foreground font-light">{d.name}</span>
                    </div>
                    <span className="text-xs font-sans text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

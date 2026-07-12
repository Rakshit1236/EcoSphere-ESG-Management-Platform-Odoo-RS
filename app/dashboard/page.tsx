"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Leaf, ArrowLeft, AlertTriangle, Users, BarChart3, Shield, Activity, LogOut, User,
  Download, FileSpreadsheet, Lock,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell, Legend,
} from "recharts";

interface ScoreData {
  overallEsg: number; totalDepartments: number; totalOverdueIssues: number;
  departments: { departmentId: string; departmentName: string; departmentCode: string; environmentalScore: number; socialScore: number; governanceScore: number; totalScore: number; hasOverdueCompliance: boolean }[];
  weighting: { environmental: number; social: number; governance: number };
}
interface EmissionsData { bySource: Record<string, number>; byMonth: Record<string, Record<string, number>>; }

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

function RadialGauge({ score }: { score: number }) {
  const fill = score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-44 h-44 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="72%" outerRadius="100%" barSize={10} data={[{ name: "ESG", value: score, fill }]} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "var(--bg-input)" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[var(--text-primary)]">{score}</span>
        <span className="text-[11px] text-[var(--text-muted)]">Overall ESG</span>
      </div>
    </div>
  );
}

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ExecutiveDashboard() {
  const router = useRouter();
  const [scores, setScores] = useState<ScoreData | null>(null);
  const [emissions, setEmissions] = useState<EmissionsData | null>(null);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (!d.user) { router.push("/login"); return; }
      setUserName(d.user.name || "");
      const role = d.user.role;
      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
        fetch("/api/departments/scores").then(r => r.json()).then(d => setScores(d.data));
        fetch("/api/emissions").then(r => r.json()).then(d => setEmissions(d));
      }
    });
  }, [router]);

  function exportReport() {
    if (!scores || !emissions) return;
    setExporting(true);

    const lines: string[] = [];
    lines.push("EcoSphere ESG Report");
    lines.push(`Generated,${new Date().toLocaleString()}`);
    lines.push(`Overall ESG Score,${scores.overallEsg}`);
    lines.push(`Total Departments,${scores.totalDepartments}`);
    lines.push(`Overdue Compliance Issues,${scores.totalOverdueIssues}`);
    lines.push(`Weighting,Environmental ${scores.weighting.environmental * 100}% / Social ${scores.weighting.social * 100}% / Governance ${scores.weighting.governance * 100}%`);
    lines.push("");

    lines.push("Department Leaderboard");
    lines.push("Rank,Department,Code,Environmental,Social,Governance,Total,Overdue Compliance");
    scores.departments.forEach((d, i) => {
      lines.push(`${i + 1},"${d.departmentName}",${d.departmentCode},${d.environmentalScore},${d.socialScore},${d.governanceScore},${d.totalScore},${d.hasOverdueCompliance ? "YES" : "NO"}`);
    });
    lines.push("");

    lines.push("Emissions by Source");
    lines.push("Source,Total Emissions (kg CO2e)");
    Object.entries(emissions.bySource).forEach(([name, value]) => {
      lines.push(`"${name}",${Math.round(value).toLocaleString()}`);
    });
    lines.push("");

    const allMonths = [...new Set(Object.keys(emissions.byMonth))].sort();
    const allSources = [...new Set(Object.values(emissions.byMonth).flatMap(s => Object.keys(s)))];
    lines.push("Monthly Emissions Trend");
    lines.push(["Month", ...allSources].join(","));
    allMonths.forEach(m => {
      const monthLabel = new Date(m + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const sources = emissions.byMonth[m];
      lines.push([monthLabel, ...allSources.map(s => Math.round(sources[s] || 0))].join(","));
    });

    downloadCSV(lines.join("\n"), `ecosphere-esg-report-${new Date().toISOString().slice(0, 10)}.csv`);
    setExporting(false);
  }

  const chartData = emissions
    ? Object.entries(emissions.byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([m, s]) => ({
        month: new Date(m + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        ...s,
      }))
    : [];
  const sourceNames = emissions ? Object.keys(emissions.bySource) : [];
  const pieData = emissions ? Object.entries(emissions.bySource).map(([n, v]) => ({ name: n, value: Math.round(v) })) : [];

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <span className="text-[var(--text-muted)]">Loading...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Access Restricted</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              The Executive Dashboard is only available to Admin users. Your current role does not have access.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/gamification">
                <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" />Back to Hub</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="gap-2"><User className="w-4 h-4" />My Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-nav)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/gamification" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-[var(--text-primary)] hidden sm:inline">EcoSphere</span>
            <Badge variant="info" className="text-[10px] uppercase tracking-wide ml-0.5">Admin</Badge>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/gamification">
              <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Hub</span></Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2"><User className="w-4 h-4" /><span className="hidden sm:inline">Profile</span></Button>
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-emerald-600 text-white text-xs font-semibold">{userName?.split(" ").map((n: string) => n[0]).join("") || "?"}</AvatarFallback>
              </Avatar>
            </div>
            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })} title="Sign out">
              <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Executive Analytics</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">Real-time ESG performance across all departments</p>
          </div>
          <Button onClick={exportReport} disabled={exporting || !scores} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />{exporting ? "Exporting..." : "Export Report"}
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Overall ESG", value: scores?.overallEsg ?? "—", icon: Activity, color: "emerald" },
            { label: "Departments", value: scores?.totalDepartments ?? 0, icon: Users, color: "blue" },
            { label: "Overdue Issues", value: scores?.totalOverdueIssues ?? 0, icon: AlertTriangle, color: "red" },
            { label: "Weighting", value: "E40 S30 G30", icon: Shield, color: "amber" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)] mb-0.5">{label}</p>
                    <p className={`text-2xl font-bold ${color === "red" ? "text-red-500" : "text-[var(--text-primary)]"}`}>{value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-100 dark:bg-${color}-500/20`}>
                    <Icon className={`w-5 h-5 text-${color}-500`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Company ESG Score</CardTitle>
              <CardDescription>Weighted composite score</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-5">
              <RadialGauge score={scores?.overallEsg || 0} />
              <div className="flex gap-6 mt-3">
                {[{ l: "Environmental", c: "text-emerald-500" }, { l: "Social", c: "text-blue-500" }, { l: "Governance", c: "text-amber-500" }].map(({ l, c }) => (
                  <div key={l} className="text-center"><p className={`text-[11px] font-medium ${c}`}>{l}</p></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Emissions Trend</CardTitle>
              <CardDescription>Carbon emissions by source over time (kg CO&#8322;e)</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      {sourceNames.map((n, i) => (
                        <linearGradient key={n} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "12px" }} formatter={(v: number) => [`${Math.round(v).toLocaleString()} kg`]} />
                    {sourceNames.map((n, i) => (
                      <Area key={n} type="monotone" dataKey={n} stackId="1" stroke={COLORS[i % COLORS.length]} fill={`url(#g${i})`} strokeWidth={1.5} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">Loading...</div>}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Emissions by Source</CardTitle>
              <CardDescription>Distribution across operations</CardDescription>
            </CardHeader>
            <CardContent className="h-56">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "12px" }} formatter={(v: number) => [`${v.toLocaleString()} kg`]} />
                    <Legend formatter={(v: string) => <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">Loading...</div>}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-emerald-500" />Department Leaderboard</CardTitle>
              <CardDescription>Ranked by total ESG score</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Env</TableHead>
                    <TableHead className="text-right">Soc</TableHead>
                    <TableHead className="text-right">Gov</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores?.departments.map((d, i) => (
                    <TableRow key={d.departmentId}>
                      <TableCell>
                        <span className={`font-bold text-xs ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-[var(--text-muted)]"}`}>{i + 1}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--text-primary)] text-sm">{d.departmentName}</span>
                          <Badge variant="secondary" className="text-[10px]">{d.departmentCode}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm"><span className="text-emerald-500 font-medium">{d.environmentalScore}</span></TableCell>
                      <TableCell className="text-right text-sm"><span className="text-blue-500 font-medium">{d.socialScore}</span></TableCell>
                      <TableCell className="text-right text-sm"><span className="text-amber-500 font-medium">{d.governanceScore}</span></TableCell>
                      <TableCell className="text-right text-sm font-bold text-[var(--text-primary)]">{d.totalScore}</TableCell>
                      <TableCell>{d.hasOverdueCompliance && <span title="Overdue compliance"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /></span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

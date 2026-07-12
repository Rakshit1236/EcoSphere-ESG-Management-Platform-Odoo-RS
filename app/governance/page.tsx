"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Shield, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Panel } from "@/components/ui/panel";
import { PageHdr } from "@/components/ui/page-header";
import { Chip } from "@/components/ui/chip";

export default function GovernancePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <AppShell>
      <div className="space-y-7">
        <PageHdr tag="ESG Pillar" title="Governance." sub="Compliance, audits, policies, and risk management" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Governance Score", v: "91.2", ch: "+1.8pts", up: true, I: Shield, s: "vs Q3 2024" },
            { l: "Compliance Rate", v: "94.2%", ch: "+1.2%", up: true, I: CheckCircle, s: "78 of 83 controls" },
            { l: "Open Risks", v: "7", ch: "−3", up: true, I: AlertTriangle, s: "2 critical" },
            { l: "Active Policies", v: "42", ch: "+2", up: true, I: FileText, s: "5 pending review" },
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
          <Panel title="Recent Audits" sub="Q4 2024">
            <div className="space-y-0">
              {[
                { n: "ISO 14001 Environmental", d: "Dec 15", passed: true, score: 94 },
                { n: "SOC 2 Type II", d: "Dec 08", passed: true, score: 97 },
                { n: "GDPR Data Privacy", d: "Nov 22", passed: true, score: 91 },
                { n: "Supply Chain Ethics", d: "Nov 10", passed: false, score: null },
                { n: "Anti-Corruption Policy", d: "Oct 28", passed: true, score: 88 },
              ].map(a => (
                <div key={a.n} className="flex items-center justify-between py-3.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-sans font-light text-foreground">{a.n}</p>
                    <p className="text-[10px] font-sans text-muted-foreground">{a.d}, 2024</p>
                  </div>
                  {a.score ? <span className="font-display text-xl font-light text-primary">{a.score}</span> : <Chip tone="amber">Review</Chip>}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Policy Library" sub="Active governance documents">
            <div className="space-y-0">
              {[
                { n: "Environmental Management Policy", v: "v4.2", u: "Nov 2024", a: true },
                { n: "Supplier Code of Conduct", v: "v3.1", u: "Dec 2024", a: false },
                { n: "Anti-Bribery & Corruption", v: "v2.8", u: "Sep 2024", a: true },
                { n: "Board Diversity Charter", v: "v1.6", u: "Oct 2024", a: true },
                { n: "Whistleblower Protection", v: "v2.1", u: "Aug 2024", a: true },
              ].map(p => (
                <div key={p.n} className="flex items-center justify-between py-3.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-sans font-light text-foreground">{p.n}</p>
                    <p className="text-[10px] font-sans text-muted-foreground">{p.v} · {p.u}</p>
                  </div>
                  <Chip tone={p.a ? "green" : "gold"}>{p.a ? "active" : "review"}</Chip>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

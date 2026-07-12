"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Zap, Users, ArrowRight, X, CheckCircle, Award, Trophy, Send } from "lucide-react";
import AppShell from "@/components/AppShell";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHdr } from "@/components/ui/page-header";
import { Chip } from "@/components/ui/chip";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

const list = [
  { n: "Zero Waste Week", d: "Eliminate all single-use plastics for 7 days", xp: 500, p: 847, days: 4, type: "Environmental" },
  { n: "Carbon-Free Commute", d: "Walk, bike, or use transit for 2 weeks", xp: 750, p: 623, days: 11, type: "Environmental" },
  { n: "Paperless Office", d: "Go fully digital for an entire month", xp: 400, p: 1204, days: 18, type: "Operational" },
  { n: "Volunteer Day", d: "Spend 8 hours on a community service project", xp: 600, p: 389, days: 6, type: "Social" },
  { n: "Energy Audit", d: "Identify 5 energy waste spots in your workspace", xp: 350, p: 712, days: 25, type: "Environmental" },
  { n: "Sustainable Lunch", d: "Eat plant-based lunches for 5 consecutive days", xp: 300, p: 956, days: 3, type: "Social" },
];

export default function ChallengesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [submitTarget, setSubmitTarget] = useState<string | null>(null);
  const [proof, setProof] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [badgeWon, setBadgeWon] = useState<{ name: string; xp: number; badge?: string } | null>(null);

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  const userId = (session?.user as any)?.id;

  const handleCreate = () => {
    if (!challengeName.trim()) return;
    setShowCreate(false); setChallengeName("");
  };

  const toggleJoin = (name: string) => {
    setJoined(p => { const n = new Set(p); if (n.has(name)) n.delete(name); else n.add(name); return n; });
  };

  const openSubmit = (name: string) => {
    setSubmitTarget(name);
    setProof("");
  };

  const handleSubmit = async () => {
    if (!submitTarget || !proof.trim()) return;
    setSubmitting(true);
    const challenge = list.find(c => c.n === submitTarget);
    const xp = challenge?.xp || 100;

    try {
      if (userId) {
        await fetch("/api/challenges/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ challengeId: submitTarget, userId, proofUrl: proof }),
        }).catch(() => {});
      }
    } catch {}

    setSubmitted(p => { const n = new Set(p); n.add(submitTarget); return n; });
    setSubmitTarget(null);
    setProof("");
    setSubmitting(false);
    setBadgeWon({ name: submitTarget, xp, badge: "Green Champion" });
    setTimeout(() => setBadgeWon(null), 5000);
  };

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="flex items-end justify-between pt-1">
          <PageHdr tag="Engagement" title="Challenges." sub="Active sustainability challenges — earn XP and badges" />
          <motion.button onClick={() => setShowCreate(true)} whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md">
            Create <Plus className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {list.map((c, i) => (
            <motion.div key={c.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard dark hover className="p-6 border border-white/[0.07]">
                <div className="flex items-start justify-between mb-4">
                  <Chip tone={c.type === "Environmental" ? "green" : c.type === "Social" ? "blue" : "muted"}>{c.type}</Chip>
                  <div className="flex items-center gap-1.5 text-primary">
                    <Zap className="w-3.5 h-3.5" /><span className="text-xs font-sans font-medium">{c.xp} XP</span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-normal text-foreground mb-2">{c.n}</h3>
                <p className="text-sm font-sans text-muted-foreground font-light leading-relaxed mb-5">{c.d}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground font-light">
                    <Users className="w-3.5 h-3.5" />{c.p.toLocaleString()}{c.days <= 5 && <span className="text-amber-400 ml-2">· {c.days}d left</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {submitted.has(c.n) ? (
                      <div className="flex items-center gap-1.5 text-xs font-sans text-primary">
                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                      </div>
                    ) : joined.has(c.n) ? (
                      <>
                        <motion.button onClick={() => openSubmit(c.n)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-1.5 px-3 py-2 border border-primary/40 text-primary text-xs font-sans hover:bg-primary/10 transition-colors rounded-md">
                          <Send className="w-3 h-3" /> Submit
                        </motion.button>
                        <motion.button onClick={() => toggleJoin(c.n)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground text-xs font-sans hover:text-foreground transition-colors rounded-md">
                          Leave
                        </motion.button>
                      </>
                    ) : (
                      <motion.button onClick={() => toggleJoin(c.n)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-1.5 px-4 py-2 border border-primary/40 text-primary text-xs font-sans hover:bg-primary/10 transition-colors rounded-md">
                        Join <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/** Submit Proof Modal */}
      <AnimatePresence>
        {submitTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSubmitTarget(null)}>
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-sans font-medium text-foreground text-sm">Submit: {submitTarget}</h3>
                <button onClick={() => setSubmitTarget(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <label className="text-[10px] font-sans text-muted-foreground/55 uppercase tracking-[0.2em] block mb-2">Proof / Description</label>
              <textarea value={proof} onChange={e => setProof(e.target.value)} placeholder="Describe how you completed this challenge..."
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm font-sans bg-muted/50 border border-border focus:outline-none focus:border-primary/40 text-foreground rounded-md mb-5 resize-none" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setSubmitTarget(null)} className="px-4 py-2 text-xs font-sans text-muted-foreground border border-border rounded-md hover:text-foreground">Cancel</button>
                <motion.button onClick={handleSubmit} disabled={submitting || !proof.trim()} whileHover={{ scale: 1.02 }}
                  className="px-4 py-2 text-xs font-sans bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit & Earn XP"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/** Badge Won Notification */}
      <AnimatePresence>
        {badgeWon && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-50 bg-card border border-primary/30 rounded-xl p-5 shadow-2xl max-w-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans font-medium text-foreground">Challenge Complete!</p>
                <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">
                  You earned <span className="text-primary font-medium">{badgeWon.xp} XP</span>
                  {badgeWon.badge && <> and unlocked the <span className="text-primary font-medium">{badgeWon.badge}</span> badge!</>}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-sans text-foreground">Badge awarded</span>
                </div>
              </div>
              <button onClick={() => setBadgeWon(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/** Create Challenge Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-sans font-medium text-foreground text-sm">Create Challenge</h3>
                <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <label className="text-[10px] font-sans text-muted-foreground/55 uppercase tracking-[0.2em] block mb-2">Challenge Name</label>
              <input value={challengeName} onChange={e => setChallengeName(e.target.value)} placeholder="e.g. Plastic-Free Month"
                className="w-full px-3.5 py-2.5 text-sm font-sans bg-muted/50 border border-border focus:outline-none focus:border-primary/40 text-foreground rounded-md mb-5" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-xs font-sans text-muted-foreground border border-border rounded-md hover:text-foreground">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 text-xs font-sans bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

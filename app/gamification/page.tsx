"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Leaf, Trophy, Zap, Star, Award, Target, Gift, Lock, CheckCircle2,
  ArrowRight, BarChart3, Sparkles, Clock, Upload, LogOut, ImagePlus, X, User,
} from "lucide-react";

interface UserData {
  id: string; name: string; email: string; role: string; totalXp: number; availablePoints: number;
  department: { name: string; code: string };
  userBadges: { badge: { id: string; name: string; description: string; unlockRule: any }; unlockedAt: string }[];
  challengeParticipations: { challenge: { id: string; title: string; xpReward: number; difficulty: string; category: { name: string }; evidenceRequired: boolean; deadline: string }; progress: number; approvalStatus: string; xpAwarded: number }[];
}
interface ChallengeData {
  id: string; title: string; description: string; xpReward: number; difficulty: string;
  evidenceRequired: boolean; deadline: string; category: { name: string }; participations: any[];
}
interface RewardData { id: string; name: string; description: string; pointsRequired: number; stockCount: number; }
interface BadgeData { id: string; name: string; description: string; unlockRule: any; userBadges: { userId: string }[]; }

const XP_PER_LEVEL = 500;
const diffColor: Record<string, string> = {
  EASY: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  MEDIUM: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
  HARD: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
};

export default function GamificationHub() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [sel, setSel] = useState<ChallengeData | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const fetchUser = useCallback((id: string) => {
    fetch(`/api/users?userId=${id}`).then(r => r.json()).then(d => setUser(d.user));
  }, []);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (!d.user) { router.push("/login"); return; }
      fetchUser(d.user.id);
    });
    fetch("/api/challenges").then(r => r.json()).then(d => setChallenges(d.challenges));
    fetch("/api/rewards").then(r => r.json()).then(d => setRewards(d.rewards));
    fetch("/api/badges").then(r => r.json()).then(d => setBadges(d.badges));
  }, [router, fetchUser]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeFile() {
    setProofFile(null);
    setPreviewUrl("");
  }

  async function handleSubmit() {
    if (!sel || !user || !proofFile) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("file", proofFile);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    const uploadData = await uploadRes.json();
    if (!uploadData.success) {
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: sel.id, userId: user.id, proofUrl: uploadData.url }),
    });
    const data = await res.json();
    if (data.success) {
      fetchUser(user.id);
      fetch("/api/challenges").then(r => r.json()).then(d => setChallenges(d.challenges));
      setSel(null); setProofFile(null); setPreviewUrl("");
    }
    setSubmitting(false);
  }

  async function handleRedeem(rewardId: string) {
    if (!user) return;
    setRedeemingId(rewardId);
    const res = await fetch("/api/rewards/redeem", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, rewardId }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(prev => prev ? { ...prev, availablePoints: data.data.remainingPoints } : prev);
      setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, stockCount: data.data.remainingStock } : r));
    }
    setRedeemingId(null);
  }

  const xpLevel = user ? Math.floor(user.totalXp / XP_PER_LEVEL) + 1 : 1;
  const xpProgress = user ? (user.totalXp % XP_PER_LEVEL) / XP_PER_LEVEL * 100 : 0;
  const unlocked = new Set(user?.userBadges.map(ub => ub.badge.id) || []);
  const initials = user?.name?.split(" ").map(n => n[0]).join("") || "?";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-nav)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/gamification" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-[var(--text-primary)] hidden sm:inline">EcoSphere</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Profile</span>
              </Button>
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-emerald-600 text-white text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:inline">{user?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })} title="Sign out">
              <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Profile Banner */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6 sm:p-8 relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar className="h-18 w-18 ring-4 ring-emerald-500/20 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xl font-bold h-full w-full flex items-center justify-center">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl font-bold text-[var(--text-primary)]">{user?.name}</h1>
                  <Badge variant="info" className="text-[10px] uppercase tracking-wide">{user?.role}</Badge>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-3">{user?.department?.name} &middot; {user?.email}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 w-full sm:max-w-xs">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-muted)]">Level {xpLevel}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{user?.totalXp || 0} XP</span>
                    </div>
                    <Progress value={xpProgress} />
                  </div>
                  <div className="flex gap-5">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-lg font-bold">{user?.totalXp || 0}</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">Total XP</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-emerald-500">
                        <Star className="w-3.5 h-3.5" />
                        <span className="text-lg font-bold">{user?.availablePoints || 0}</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="challenges" className="gap-1.5"><Target className="w-4 h-4" /> Challenges</TabsTrigger>
            <TabsTrigger value="badges" className="gap-1.5"><Award className="w-4 h-4" /> Badges</TabsTrigger>
            <TabsTrigger value="rewards" className="gap-1.5"><Gift className="w-4 h-4" /> Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map(ch => {
                const done = user?.challengeParticipations.some(cp => cp.challenge.id === ch.id && cp.approvalStatus === "APPROVED");
                const days = Math.max(0, Math.ceil((new Date(ch.deadline).getTime() - Date.now()) / 86400000));
                return (
                  <Card key={ch.id} className={`transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] ${done ? "opacity-70" : "hover:border-emerald-500/30 cursor-pointer"}`} onClick={() => !done && setSel(ch)}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`text-[10px] ${diffColor[ch.difficulty]}`} variant="outline">{ch.difficulty}</Badge>
                        {done ? <Badge variant="success" className="text-[10px] gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</Badge> : <Badge variant="secondary" className="text-[10px]">{ch.category.name}</Badge>}
                      </div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1">{ch.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{ch.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold"><Trophy className="w-3.5 h-3.5" />+{ch.xpReward} XP</span>
                        <span className="flex items-center gap-1 text-[var(--text-muted)] text-xs"><Clock className="w-3 h-3" />{days}d left</span>
                      </div>
                      {ch.evidenceRequired && <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1"><Upload className="w-3 h-3" />Evidence required</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="badges">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {badges.map(b => {
                const got = unlocked.has(b.id);
                return (
                  <Card key={b.id} className={`text-center transition-all ${got ? "border-emerald-500/30" : "opacity-50 hover:opacity-70"}`}>
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2.5 ${got ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20" : "bg-[var(--bg-input)]"}`}>
                        {got ? <Sparkles className="w-6 h-6 text-white" /> : <Lock className="w-5 h-5 text-[var(--text-muted)]" />}
                      </div>
                      <h4 className={`text-xs font-semibold mb-0.5 ${got ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>{b.name}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{b.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map(r => {
                const afford = (user?.availablePoints || 0) >= r.pointsRequired;
                return (
                  <Card key={r.id} className="transition-all hover:shadow-[var(--shadow-card-hover)]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center"><Gift className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                        <Badge variant={r.stockCount > 0 ? "secondary" : "destructive"} className="text-[10px]">{r.stockCount > 0 ? `${r.stockCount} in stock` : "Out of stock"}</Badge>
                      </div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1">{r.name}</h3>
                      <p className="text-sm text-[var(--text-muted)] mb-4">{r.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-amber-500 text-sm font-semibold"><Star className="w-3.5 h-3.5" />{r.pointsRequired} pts</span>
                        <Button size="sm" variant={afford ? "default" : "secondary"} disabled={!afford || r.stockCount <= 0 || redeemingId === r.id} onClick={() => handleRedeem(r.id)}>
                          {redeemingId === r.id ? "..." : afford ? "Redeem" : "Not enough"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Submission Modal */}
      <Dialog open={!!sel} onOpenChange={o => { if (!o) { setSel(null); setProofFile(null); setPreviewUrl(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-emerald-500" />{sel?.title}</DialogTitle>
            <DialogDescription>+{sel?.xpReward} XP &middot; {sel?.difficulty}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">{sel?.description}</p>

            {/* File Upload Zone */}
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Upload Proof Image</label>
              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)]">
                  <img src={previewUrl} alt="Proof preview" className="w-full h-48 object-cover" />
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">{proofFile?.name}</p>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-input)] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group">
                  <ImagePlus className="w-10 h-10 text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors mb-2" />
                  <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">Click to upload an image</span>
                  <span className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG, GIF, WebP &middot; Max 10MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSel(null); setProofFile(null); setPreviewUrl(""); }}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!proofFile || submitting} className="gap-2">
              {submitting ? "Uploading..." : "Submit"}{!submitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

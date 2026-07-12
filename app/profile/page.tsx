"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Leaf, ArrowLeft, Zap, Star, Award, Trophy, Target, Gift,
  Settings, Lock, CheckCircle2, Clock, LogOut, Save, Eye, EyeOff, Sparkles,
} from "lucide-react";

interface UserData {
  id: string; name: string; email: string; role: string; avatarUrl: string | null;
  totalXp: number; availablePoints: number;
  department: { name: string; code: string };
  userBadges: { badge: { id: string; name: string; description: string; unlockRule: any }; unlockedAt: string }[];
  challengeParticipations: {
    id: string; progress: number; approvalStatus: string; xpAwarded: number; submittedAt: string | null;
    challenge: { id: string; title: string; xpReward: number; difficulty: string; category: { name: string }; deadline: string };
  }[];
}

const XP_PER_LEVEL = 500;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (!d.user) { router.push("/login"); return; }
      fetch(`/api/users?userId=${d.user.id}`).then(r => r.json()).then(d => {
        if (d.user) { setUser(d.user); setEditName(d.user.name); }
      });
    });
  }, [router]);

  async function handleSaveName() {
    if (!user || !editName.trim()) return;
    setSaving(true); setSaveMsg("");
    const res = await fetch("/api/users/update", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, name: editName.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(prev => prev ? { ...prev, name: editName.trim() } : prev);
      setSaveMsg("Name updated!");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  }

  async function handleChangePassword() {
    if (!user) return;
    setPwError(""); setPwMsg("");
    if (!currentPw || !newPw || !confirmPw) { setPwError("All fields are required"); return; }
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setPwError("New passwords don't match"); return; }
    setPwSaving(true);
    const res = await fetch("/api/users/change-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, currentPassword: currentPw, newPassword: newPw }),
    });
    const data = await res.json();
    if (data.success) {
      setPwMsg("Password changed successfully!");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } else {
      setPwError(data.error || "Failed to change password");
    }
    setPwSaving(false);
  }

  if (!user) return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><span className="text-[var(--text-muted)]">Loading...</span></div>;

  const xpLevel = Math.floor(user.totalXp / XP_PER_LEVEL) + 1;
  const xpProgress = (user.totalXp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
  const initials = user.name?.split(" ").map(n => n[0]).join("") || "?";
  const completed = user.challengeParticipations.filter(cp => cp.approvalStatus === "APPROVED");
  const totalXpEarned = completed.reduce((sum, cp) => sum + cp.xpAwarded, 0);
  const unlockedBadgeCount = user.userBadges.length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-nav)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/gamification" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-[var(--text-primary)] hidden sm:inline">EcoSphere</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/gamification">
              <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Hub</span></Button>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })} title="Sign out">
              <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your account and track your sustainability journey</p>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar className="h-20 w-20 ring-4 ring-emerald-500/20 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold h-full w-full flex items-center justify-center">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h2>
                  <Badge variant="info" className="text-[10px] uppercase tracking-wide">{user.role}</Badge>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-3">{user.department?.name} &middot; {user.email}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 w-full sm:max-w-xs">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-muted)]">Level {xpLevel}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{user.totalXp} / {xpLevel * XP_PER_LEVEL} XP</span>
                    </div>
                    <Progress value={xpProgress} />
                  </div>
                  <div className="flex gap-5">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-amber-500"><Zap className="w-3.5 h-3.5" /><span className="text-lg font-bold">{user.totalXp}</span></div>
                      <span className="text-[11px] text-[var(--text-muted)]">Total XP</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-emerald-500"><Star className="w-3.5 h-3.5" /><span className="text-lg font-bold">{user.availablePoints}</span></div>
                      <span className="text-[11px] text-[var(--text-muted)]">Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Challenges Done", value: completed.length, icon: Target, color: "emerald" },
            { label: "XP Earned", value: totalXpEarned, icon: Zap, color: "amber" },
            { label: "Badges Unlocked", value: unlockedBadgeCount, icon: Award, color: "blue" },
            { label: "Points Balance", value: user.availablePoints, icon: Star, color: "purple" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center bg-${color}-100 dark:bg-${color}-500/20 mb-2`}>
                  <Icon className={`w-5 h-5 text-${color}-500`} />
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activity" className="gap-1.5"><Clock className="w-4 h-4" /> Activity</TabsTrigger>
            <TabsTrigger value="badges" className="gap-1.5"><Award className="w-4 h-4" /> Badges</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity">
            {user.challengeParticipations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
                  <p className="text-[var(--text-muted)]">No challenge activity yet</p>
                  <Link href="/gamification"><Button variant="outline" size="sm" className="mt-3">Browse Challenges</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {user.challengeParticipations.map(cp => (
                  <Card key={cp.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            cp.approvalStatus === "APPROVED" ? "bg-emerald-100 dark:bg-emerald-500/20" :
                            cp.approvalStatus === "REJECTED" ? "bg-red-100 dark:bg-red-500/20" : "bg-amber-100 dark:bg-amber-500/20"
                          }`}>
                            {cp.approvalStatus === "APPROVED" ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> :
                             cp.approvalStatus === "REJECTED" ? <Lock className="w-4.5 h-4.5 text-red-500" /> :
                             <Clock className="w-4.5 h-4.5 text-amber-500" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{cp.challenge.title}</p>
                            <p className="text-[11px] text-[var(--text-muted)]">{cp.challenge.category.name} &middot; {cp.challenge.difficulty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {cp.approvalStatus === "APPROVED" && (
                            <Badge variant="success" className="text-[10px]">+{cp.xpAwarded} XP</Badge>
                          )}
                          {cp.approvalStatus === "PENDING" && (
                            <Badge variant="warning" className="text-[10px]">Under Review</Badge>
                          )}
                          {cp.approvalStatus === "REJECTED" && (
                            <Badge variant="destructive" className="text-[10px]">Rejected</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            {user.userBadges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Award className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
                  <p className="text-[var(--text-muted)]">No badges earned yet</p>
                  <Link href="/gamification"><Button variant="outline" size="sm" className="mt-3">Complete Challenges</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {user.userBadges.map((ub, i) => (
                  <Card key={i} className="border-emerald-500/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{ub.badge.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{ub.badge.description}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Unlocked {new Date(ub.unlockedAt).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-4">
              {/* Edit Name */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Edit Name</CardTitle>
                  <CardDescription>Update your display name</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="flex-1 h-10 px-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      placeholder="Your name"
                    />
                    <Button onClick={handleSaveName} disabled={saving || editName === user.name} className="gap-1.5">
                      <Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  {saveMsg && <p className="text-xs text-emerald-500 mt-2">{saveMsg}</p>}
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pwError && <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">{pwError}</div>}
                  {pwMsg && <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">{pwMsg}</div>}
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      placeholder="Current password"
                    />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer">
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      placeholder="New password (min. 6 characters)"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="Confirm new password"
                  />
                  <Button onClick={handleChangePassword} disabled={pwSaving} variant="outline" className="gap-1.5">
                    <Lock className="w-4 h-4" />{pwSaving ? "Updating..." : "Update Password"}
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Email</span><span className="text-[var(--text-primary)]">{user.email}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Department</span><span className="text-[var(--text-primary)]">{user.department?.name}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Role</span><span className="text-[var(--text-primary)] capitalize">{user.role?.toLowerCase()}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Member since</span><span className="text-[var(--text-primary)]">2026</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

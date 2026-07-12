import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function evaluateBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      challengeParticipations: { where: { approvalStatus: "APPROVED" } },
      userBadges: { select: { badgeId: true } },
    },
  });

  if (!user) return [];

  const unlockedBadgeIds = new Set(user.userBadges.map((ub) => ub.badgeId));
  const allBadges = await prisma.badge.findMany();
  const newBadges: any[] = [];

  for (const badge of allBadges) {
    if (unlockedBadgeIds.has(badge.id)) continue;

    const rule = badge.unlockRule as any;
    let unlocked = false;

    switch (rule.type) {
      case "challenges_completed": {
        const completed = user.challengeParticipations.length;
        unlocked = completed >= rule.threshold;
        if (rule.category) {
          const categoryChallenges = await prisma.challenge.findMany({
            where: { category: { name: rule.category } },
            select: { id: true },
          });
          const categoryIds = new Set(categoryChallenges.map((c) => c.id));
          const categoryCompleted = user.challengeParticipations.filter((cp) =>
            categoryIds.has(cp.challengeId)
          ).length;
          unlocked = categoryCompleted >= rule.threshold;
        }
        break;
      }
      case "total_xp":
        unlocked = user.totalXp >= rule.threshold;
        break;
      case "carbon_offset": {
        const totalOffset = await prisma.carbonTransaction.aggregate({
          where: { departmentId: user.departmentId },
          _sum: { calculatedEmissions: true },
        });
        unlocked = (totalOffset._sum.calculatedEmissions || 0) >= rule.threshold;
        break;
      }
    }

    if (unlocked) {
      const newBadge = await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
        include: { badge: true },
      });
      newBadges.push(newBadge);
    }
  }

  return newBadges;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, userId, proofUrl } = body;

    if (!challengeId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: challengeId, userId" },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }
    if (challenge.evidenceRequired && !proofUrl) {
      return NextResponse.json(
        { error: "This challenge requires evidence (proof URL)" },
        { status: 400 }
      );
    }

    const participation = await prisma.challengeParticipation.upsert({
      where: { challengeId_userId: { challengeId, userId } },
      update: {
        proofUrl: proofUrl || null,
        submittedAt: new Date(),
        approvalStatus: "APPROVED",
        xpAwarded: challenge.xpReward,
        progress: 100,
      },
      create: {
        challengeId,
        userId,
        proofUrl: proofUrl || null,
        submittedAt: new Date(),
        approvalStatus: "APPROVED",
        xpAwarded: challenge.xpReward,
        progress: 100,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXp: { increment: challenge.xpReward },
        availablePoints: { increment: Math.floor(challenge.xpReward / 2) },
      },
    });

    const newBadges = await evaluateBadges(userId);

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, totalXp: true, availablePoints: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        participation,
        xpAwarded: challenge.xpReward,
        pointsEarned: Math.floor(challenge.xpReward / 2),
        newBadges,
        user: updatedUser,
      },
    });
  } catch (error: any) {
    console.error("Challenge submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

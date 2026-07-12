import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        totalXp: true,
        availablePoints: true,
        department: { select: { name: true, code: true } },
        userBadges: {
          include: { badge: true },
          orderBy: { unlockedAt: "desc" },
        },
        challengeParticipations: {
          include: { challenge: { include: { category: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      totalXp: true,
      availablePoints: true,
      department: { select: { name: true, code: true } },
    },
    orderBy: { totalXp: "desc" },
  });
  return NextResponse.json({ users });
}

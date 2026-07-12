import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ user: null });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
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
  return NextResponse.json({ user });
}

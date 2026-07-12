import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const badges = await prisma.badge.findMany({
    include: { userBadges: { select: { userId: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ badges });
}

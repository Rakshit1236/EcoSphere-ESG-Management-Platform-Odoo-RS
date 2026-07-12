import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rewards = await prisma.reward.findMany({
    where: { status: "ACTIVE" },
    orderBy: { pointsRequired: "asc" },
  });
  return NextResponse.json({ rewards });
}

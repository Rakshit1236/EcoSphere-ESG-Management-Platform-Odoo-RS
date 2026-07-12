import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const challenges = await prisma.challenge.findMany({
    where: { status: "ACTIVE" },
    include: { category: true, participations: true },
    orderBy: { deadline: "asc" },
  });
  return NextResponse.json({ challenges });
}

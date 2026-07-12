import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const emissions = await prisma.carbonTransaction.findMany({
    include: { department: true, emissionFactor: true },
    orderBy: { transactionDate: "desc" },
  });

  const grouped: Record<string, number> = {};
  for (const t of emissions) {
    const key = t.sourceOperation;
    grouped[key] = (grouped[key] || 0) + t.calculatedEmissions;
  }

  const byMonth: Record<string, Record<string, number>> = {};
  for (const t of emissions) {
    const month = t.transactionDate.toISOString().slice(0, 7);
    if (!byMonth[month]) byMonth[month] = {};
    byMonth[month][t.sourceOperation] = (byMonth[month][t.sourceOperation] || 0) + t.calculatedEmissions;
  }

  return NextResponse.json({ bySource: grouped, byMonth });
}

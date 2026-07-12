import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      where: { status: "ACTIVE" },
      include: {
        scores: { orderBy: { calculatedAt: "desc" }, take: 1 },
      },
    });

    const overdueIssues = await prisma.complianceIssue.findMany({
      where: {
        status: "OPEN",
        dueDate: { lt: new Date() },
      },
      select: { ownerId: true, auditId: true },
    });

    const overdueOwnerIds = new Set(overdueIssues.map((i) => i.ownerId));

    const departmentScores = departments.map((dept) => {
      const score = dept.scores[0];
      const latestScore = score
        ? {
            departmentId: dept.id,
            departmentName: dept.name,
            departmentCode: dept.code,
            environmentalScore: score.environmentalScore,
            socialScore: score.socialScore,
            governanceScore: score.governanceScore,
            totalScore: Math.round(
              score.environmentalScore * 0.4 +
                score.socialScore * 0.3 +
                score.governanceScore * 0.3
            ),
            hasOverdueCompliance: overdueOwnerIds.has(dept.id),
            calculatedAt: score.calculatedAt,
          }
        : {
            departmentId: dept.id,
            departmentName: dept.name,
            departmentCode: dept.code,
            environmentalScore: 0,
            socialScore: 0,
            governanceScore: 0,
            totalScore: 0,
            hasOverdueCompliance: false,
            calculatedAt: null,
          };
      return latestScore;
    });

    departmentScores.sort((a, b) => b.totalScore - a.totalScore);

    const overallEsg =
      departmentScores.length > 0
        ? Math.round(
            departmentScores.reduce((sum, d) => sum + d.totalScore, 0) /
              departmentScores.length
          )
        : 0;

    const totalOverdueIssues = overdueIssues.length;

    return NextResponse.json({
      success: true,
      data: {
        overallEsg,
        totalDepartments: departmentScores.length,
        totalOverdueIssues,
        departments: departmentScores,
        weighting: { environmental: 0.4, social: 0.3, governance: 0.3 },
      },
    });
  } catch (error) {
    console.error("Department scores error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

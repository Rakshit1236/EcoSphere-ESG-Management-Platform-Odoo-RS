import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, rewardId } = body;

    if (!userId || !rewardId) {
      return NextResponse.json(
        { error: "Missing required fields: userId, rewardId" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      const reward = await tx.reward.findUnique({ where: { id: rewardId } });
      if (!reward) throw new Error("Reward not found");
      if (reward.status !== "ACTIVE") throw new Error("Reward is not active");
      if (reward.stockCount <= 0) throw new Error("Reward is out of stock");
      if (user.availablePoints < reward.pointsRequired) {
        throw new Error(
          `Insufficient points. You have ${user.availablePoints} but need ${reward.pointsRequired}`
        );
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { availablePoints: { decrement: reward.pointsRequired } },
      });

      const updatedReward = await tx.reward.update({
        where: { id: rewardId },
        data: { stockCount: { decrement: 1 } },
      });

      const redemption = await tx.rewardRedemption.create({
        data: {
          userId,
          rewardId,
          pointsSpent: reward.pointsRequired,
          status: "PENDING",
        },
        include: { reward: true, user: { select: { name: true, availablePoints: true } } },
      });

      return {
        redemption,
        remainingPoints: updatedUser.availablePoints,
        remainingStock: updatedReward.stockCount,
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Reward redemption error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message?.includes("not found") || error.message?.includes("Insufficient") ? 400 : 500 }
    );
  }
}

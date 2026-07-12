import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { departmentId, emissionFactorId, quantity, sourceOperation, notes } = body;

    if (!departmentId || !emissionFactorId || !quantity || !sourceOperation) {
      return NextResponse.json(
        { error: "Missing required fields: departmentId, emissionFactorId, quantity, sourceOperation" },
        { status: 400 }
      );
    }

    const emissionFactor = await prisma.emissionFactor.findUnique({
      where: { id: emissionFactorId },
    });

    if (!emissionFactor) {
      return NextResponse.json({ error: "Emission factor not found" }, { status: 404 });
    }

    const calculatedEmissions = emissionFactor.factorValue * quantity;

    const transaction = await prisma.carbonTransaction.create({
      data: {
        departmentId,
        emissionFactorId,
        quantity,
        calculatedEmissions,
        sourceOperation,
        notes: notes || null,
      },
      include: {
        emissionFactor: true,
        department: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
      calculation: {
        factorValue: emissionFactor.factorValue,
        factorUnit: emissionFactor.unit,
        quantity,
        calculatedEmissions,
        formula: `${quantity} ${emissionFactor.unit} × ${emissionFactor.factorValue} = ${calculatedEmissions.toFixed(2)} kg CO₂e`,
      },
    });
  } catch (error) {
    console.error("Carbon transaction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const sourceOperation = searchParams.get("sourceOperation");

    const where: any = {};
    if (departmentId) where.departmentId = departmentId;
    if (sourceOperation) where.sourceOperation = sourceOperation;

    const transactions = await prisma.carbonTransaction.findMany({
      where,
      include: { emissionFactor: true, department: true },
      orderBy: { transactionDate: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Carbon transactions fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

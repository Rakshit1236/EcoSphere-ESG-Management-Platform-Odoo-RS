import { PrismaClient, CategoryType, ChallengeStatus, ChallengeDifficulty, UserRole, DepartmentStatus, RewardStatus, ApprovalStatus, ComplianceIssueStatus } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EcoSphere database...");

  // Departments
  const engineering = await prisma.department.create({
    data: { name: "Engineering", code: "ENG", employeeCount: 45, status: DepartmentStatus.ACTIVE },
  });
  const marketing = await prisma.department.create({
    data: { name: "Marketing", code: "MKT", employeeCount: 20, status: DepartmentStatus.ACTIVE },
  });
  const operations = await prisma.department.create({
    data: { name: "Operations", code: "OPS", employeeCount: 35, status: DepartmentStatus.ACTIVE },
  });
  const hr = await prisma.department.create({
    data: { name: "Human Resources", code: "HR", employeeCount: 12, status: DepartmentStatus.ACTIVE },
  });
  const finance = await prisma.department.create({
    data: { name: "Finance", code: "FIN", employeeCount: 15, status: DepartmentStatus.ACTIVE },
  });

  // Emission Factors
  const efElectricity = await prisma.emissionFactor.create({
    data: { activityType: "Electricity Usage", factorValue: 0.7, unit: "kWh" },
  });
  const efTravel = await prisma.emissionFactor.create({
    data: { activityType: "Business Travel", factorValue: 0.255, unit: "km" },
  });
  const efWaste = await prisma.emissionFactor.create({
    data: { activityType: "Waste Disposal", factorValue: 2.5, unit: "kg" },
  });
  const efWater = await prisma.emissionFactor.create({
    data: { activityType: "Water Consumption", factorValue: 0.0003, unit: "liters" },
  });

  // Categories
  const csrCategory = await prisma.category.create({
    data: { name: "Community Service", type: CategoryType.CSR_ACTIVITY },
  });
  const greenChallenge = await prisma.category.create({
    data: { name: "Green Challenge", type: CategoryType.CHALLENGE },
  });
  const wellnessCategory = await prisma.category.create({
    data: { name: "Employee Wellness", type: CategoryType.CHALLENGE },
  });

  // Badges
  await prisma.badge.createMany({
    data: [
      {
        name: "First Step",
        description: "Complete your first challenge",
        unlockRule: { type: "challenges_completed", threshold: 1 },
        iconSlug: "footprints",
      },
      {
        name: "Green Warrior",
        description: "Complete 5 green challenges",
        unlockRule: { type: "challenges_completed", threshold: 5, category: "Green Challenge" },
        iconSlug: "leaf",
      },
      {
        name: "Eco Champion",
        description: "Earn 500 XP total",
        unlockRule: { type: "total_xp", threshold: 500 },
        iconSlug: "trophy",
      },
      {
        name: "Sustainability Hero",
        description: "Earn 1000 XP total",
        unlockRule: { type: "total_xp", threshold: 1000 },
        iconSlug: "award",
      },
      {
        name: "Community Builder",
        description: "Complete 3 CSR activities",
        unlockRule: { type: "challenges_completed", threshold: 3, category: "Community Service" },
        iconSlug: "heart-handshake",
      },
      {
        name: "Carbon Crusher",
        description: "Offset 1000kg of CO2",
        unlockRule: { type: "carbon_offset", threshold: 1000 },
        iconSlug: "zap",
      },
    ],
  });

  // Rewards
  await prisma.reward.createMany({
    data: [
      { name: "Eco-Friendly Water Bottle", description: "Reusable stainless steel bottle", pointsRequired: 100, stockCount: 50, status: RewardStatus.ACTIVE },
      { name: "Plant a Tree", description: "We plant a tree in your name", pointsRequired: 150, stockCount: 200, status: RewardStatus.ACTIVE },
      { name: "Reusable Tote Bag", description: "Organic cotton tote bag", pointsRequired: 75, stockCount: 100, status: RewardStatus.ACTIVE },
      { name: "Coffee Shop Voucher", description: "$10 voucher for sustainable coffee", pointsRequired: 200, stockCount: 30, status: RewardStatus.ACTIVE },
      { name: "Half Day Off", description: "Take a half day off guilt-free", pointsRequired: 500, stockCount: 10, status: RewardStatus.ACTIVE },
      { name: "Charity Donation", description: "$25 donation to an eco-charity of your choice", pointsRequired: 300, stockCount: 999, status: RewardStatus.ACTIVE },
    ],
  });

  // Users
  const pw = await hash("password123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "admin@ecosphere.com",
      passwordHash: pw,
      role: UserRole.ADMIN,
      departmentId: engineering.id,
      totalXp: 750,
      availablePoints: 420,
    },
  });
  const user1 = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "alex@ecosphere.com",
      passwordHash: pw,
      role: UserRole.EMPLOYEE,
      departmentId: engineering.id,
      totalXp: 320,
      availablePoints: 180,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@ecosphere.com",
      passwordHash: pw,
      role: UserRole.MANAGER,
      departmentId: marketing.id,
      totalXp: 560,
      availablePoints: 310,
    },
  });
  await prisma.user.create({
    data: {
      name: "Marcus Johnson",
      email: "marcus@ecosphere.com",
      passwordHash: pw,
      role: UserRole.EMPLOYEE,
      departmentId: operations.id,
      totalXp: 120,
      availablePoints: 80,
    },
  });
  await prisma.user.create({
    data: {
      name: "Elena Volkov",
      email: "elena@ecosphere.com",
      passwordHash: pw,
      role: UserRole.EMPLOYEE,
      departmentId: hr.id,
      totalXp: 890,
      availablePoints: 550,
    },
  });

  // Challenges
  const ch1 = await prisma.challenge.create({
    data: {
      title: "Zero Waste Week",
      categoryId: greenChallenge.id,
      description: "Go an entire week producing zero landfill waste. Track your bins and share proof.",
      xpReward: 150,
      difficulty: ChallengeDifficulty.HARD,
      evidenceRequired: true,
      deadline: new Date("2026-08-15"),
      status: ChallengeStatus.ACTIVE,
    },
  });
  const ch2 = await prisma.challenge.create({
    data: {
      title: "Bike to Work Month",
      categoryId: greenChallenge.id,
      description: "Commute by bicycle for at least 15 working days this month.",
      xpReward: 100,
      difficulty: ChallengeDifficulty.MEDIUM,
      evidenceRequired: true,
      deadline: new Date("2026-07-31"),
      status: ChallengeStatus.ACTIVE,
    },
  });
  const ch3 = await prisma.challenge.create({
    data: {
      title: "Plant a Rooftop Garden",
      categoryId: csrCategory.id,
      description: "Organize a team event to build a rooftop garden at the office.",
      xpReward: 200,
      difficulty: ChallengeDifficulty.HARD,
      evidenceRequired: true,
      deadline: new Date("2026-09-01"),
      status: ChallengeStatus.ACTIVE,
    },
  });
  const ch4 = await prisma.challenge.create({
    data: {
      title: "5-Minute Desk Stretch",
      categoryId: wellnessCategory.id,
      description: "Do desk stretches daily for 2 weeks. Post a selfie or team photo.",
      xpReward: 30,
      difficulty: ChallengeDifficulty.EASY,
      evidenceRequired: false,
      deadline: new Date("2026-07-25"),
      status: ChallengeStatus.ACTIVE,
    },
  });
  const ch5 = await prisma.challenge.create({
    data: {
      title: "Sustainable Commute",
      categoryId: greenChallenge.id,
      description: "Use public transport, carpool, or walk to work for 10 days.",
      xpReward: 80,
      difficulty: ChallengeDifficulty.MEDIUM,
      evidenceRequired: true,
      deadline: new Date("2026-08-10"),
      status: ChallengeStatus.ACTIVE,
    },
  });

  // Challenge Participations
  await prisma.challengeParticipation.create({
    data: { challengeId: ch1.id, userId: user1.id, progress: 60, approvalStatus: ApprovalStatus.PENDING },
  });
  await prisma.challengeParticipation.create({
    data: { challengeId: ch2.id, userId: user1.id, progress: 80, proofUrl: "/proofs/bike-month.jpg", approvalStatus: ApprovalStatus.PENDING },
  });
  await prisma.challengeParticipation.create({
    data: { challengeId: ch4.id, userId: user2.id, progress: 100, proofUrl: "/proofs/stretch.jpg", approvalStatus: ApprovalStatus.APPROVED, xpAwarded: 30 },
  });

  // Carbon Transactions
  const now = new Date();
  const months = [0, 1, 2, 3, 4, 5];
  for (const m of months) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - m);
    await prisma.carbonTransaction.create({
      data: {
        departmentId: engineering.id,
        emissionFactorId: efElectricity.id,
        quantity: 12000 + Math.random() * 3000,
        calculatedEmissions: (12000 + Math.random() * 3000) * 0.7,
        sourceOperation: "Office Electricity",
        transactionDate: d,
      },
    });
    await prisma.carbonTransaction.create({
      data: {
        departmentId: operations.id,
        emissionFactorId: efTravel.id,
        quantity: 5000 + Math.random() * 2000,
        calculatedEmissions: (5000 + Math.random() * 2000) * 0.255,
        sourceOperation: "Fleet Travel",
        transactionDate: d,
      },
    });
    await prisma.carbonTransaction.create({
      data: {
        departmentId: marketing.id,
        emissionFactorId: efWaste.id,
        quantity: 800 + Math.random() * 400,
        calculatedEmissions: (800 + Math.random() * 400) * 2.5,
        sourceOperation: "Event Waste",
        transactionDate: d,
      },
    });
  }

  // Department Scores
  for (const dept of [engineering, marketing, operations, hr, finance]) {
    await prisma.departmentScore.create({
      data: {
        departmentId: dept.id,
        environmentalScore: Math.round(Math.random() * 40 + 50),
        socialScore: Math.round(Math.random() * 30 + 60),
        governanceScore: Math.round(Math.random() * 25 + 70),
        totalScore: 0,
        calculatedAt: now,
      },
    });
  }

  // Compliance Issues
  await prisma.complianceIssue.create({
    data: {
      auditId: "AUD-2026-001",
      severity: 4,
      description: "Missing waste disposal records for Q1 2026",
      ownerId: admin.id,
      dueDate: new Date("2026-06-15"),
      status: ComplianceIssueStatus.OPEN,
    },
  });
  await prisma.complianceIssue.create({
    data: {
      auditId: "AUD-2026-002",
      severity: 2,
      description: "Energy audit report pending submission",
      ownerId: user2.id,
      dueDate: new Date("2026-07-01"),
      status: ComplianceIssueStatus.OPEN,
    },
  });
  await prisma.complianceIssue.create({
    data: {
      auditId: "AUD-2026-003",
      severity: 3,
      description: "Water usage report overdue for March",
      ownerId: user1.id,
      dueDate: new Date("2026-05-30"),
      status: ComplianceIssueStatus.OPEN,
    },
  });

  // User Badges
  await prisma.userBadge.create({
    data: { userId: admin.id, badgeId: (await prisma.badge.findUnique({ where: { name: "First Step" } }))!.id },
  });
  await prisma.userBadge.create({
    data: { userId: admin.id, badgeId: (await prisma.badge.findUnique({ where: { name: "Eco Champion" } }))!.id },
  });
  await prisma.userBadge.create({
    data: { userId: user2.id, badgeId: (await prisma.badge.findUnique({ where: { name: "First Step" } }))!.id },
  });

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

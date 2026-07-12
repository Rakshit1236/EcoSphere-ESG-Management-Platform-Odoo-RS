<div align="center">

# 🌿 EcoSphere

### Enterprise ESG Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#)

**Track. Analyze. Comply. Gamify.**

A unified platform that transforms sustainability from a compliance burden
into an engaging, gamified organizational culture.

[Get Started](#-quick-start) · [Features](#-features) · [Tech Stack](#-tech-stack) · [API](#-api-documentation) · [Screenshots](#-screenshots)

</div>

---

## ✨ Overview

EcoSphere integrates operational data, employee participation, and compliance activities into a single dashboard — while encouraging sustainability through gamification, XP rewards, and badges.

Built for the **Odoo Hackathon 2026**, EcoSphere demonstrates how enterprise ESG tracking can be both rigorous and engaging.

---

## 🚀 Features

### 🎮 Gamification Hub
- **Challenge System** — Browse, accept, and submit sustainability challenges with proof upload
- **XP & Levels** — Earn experience points, level up, and track progress
- **Badges** — Unlock achievement badges based on rules (challenges completed, XP earned, carbon offset)
- **Rewards Catalog** — Spend earned points on real rewards (eco-products, half-day off, charity donations)

### 📊 Executive Analytics Dashboard
- **ESG Score Dial** — Real-time weighted composite score (Environmental 40% · Social 30% · Governance 30%)
- **Emissions Trend** — Stacked area chart tracking carbon emissions by source over time
- **Emissions Breakdown** — Pie chart showing emission distribution across operations
- **Department Leaderboard** — Ranked table with individual E, S, G scores + overdue compliance warnings

### 🔐 Authentication & Access Control
- **NextAuth v5** — Secure credentials-based authentication with JWT sessions
- **User Registration** — New user signup with department selection
- **Route Protection** — Middleware-based auth guards on all protected routes
- **Role System** — Employee, Manager, Admin, Super Admin roles

### 🌗 Light & Dark Mode
- Full dual-theme support with system preference detection
- Theme persists in localStorage across sessions
- Toggle in navigation bar

### 🌍 Carbon Tracking
- **Auto Emission Calculator** — Automatically computes CO₂e from activity type × quantity
- **Source Tracking** — Track emissions by operation type (Electricity, Travel, Waste, Water)
- **Department Attribution** — Emissions linked to specific departments

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Radix UI primitives |
| **Charts** | Recharts (Area, Radial, Pie) |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes (Serverless) |
| **Database** | PostgreSQL 18 |
| **ORM** | Prisma 6 |
| **Auth** | NextAuth v5 (Credentials Provider) |
| **Language** | TypeScript (97.6%) |

---

## 📁 Project Structure

```
ecosphere/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth handler
│   │   │   ├── session/          # Session + full user data
│   │   │   └── signup/           # User registration
│   │   ├── badges/               # Badge catalog
│   │   ├── carbon-transactions/  # Emission logging + auto-calc
│   │   ├── challenges/
│   │   │   ├── route.ts          # Challenge listing
│   │   │   └── submit/           # Submit + badge auto-award
│   │   ├── departments/
│   │   │   ├── route.ts          # Department listing
│   │   │   └── scores/           # ESG scores + compliance flags
│   │   ├── emissions/            # Aggregated emission data
│   │   ├── rewards/
│   │   │   ├── route.ts          # Reward catalog
│   │   │   └── redeem/           # Atomic point redemption
│   │   └── users/                # User data
│   ├── gamification/             # Employee gamification hub
│   ├── dashboard/                # Executive analytics dashboard
│   ├── login/                    # Login page
│   ├── signup/                   # Registration page
│   ├── globals.css               # Dual-theme CSS variables
│   └── layout.tsx                # Root layout with providers
├── components/
│   ├── ui/                       # Reusable UI primitives
│   ├── Providers.tsx             # Theme + Auth providers
│   └── ThemeToggle.tsx           # Light/dark toggle
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client singleton
│   ├── theme-provider.tsx        # Theme context
│   └── utils.ts                  # Utility functions
├── prisma/
│   ├── schema.prisma             # Database schema (11 models)
│   └── seed.ts                   # Sample data seeder
└── middleware.ts                  # Route protection
```

---

## 🗄 Database Schema

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Department     │────<│      User         │────<│  Challenge      │
│   Category       │     │   CarbonTxn      │     │  Participation  │
│   EmissionFactor │     │   EmployeePart.  │     │  ComplianceIssue│
│   Badge          │     │   DepartmentScore│     │                 │
│   Reward         │     │   UserBadge      │     │                 │
│                  │     │   RewardRedemption│     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**11 Models** · **4 Enums** · **Full relational integrity**

---

## 🔌 API Documentation

### Carbon Emissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/carbon-transactions` | Log emission — auto-calculates CO₂e |
| `GET` | `/api/carbon-transactions` | Fetch transactions (filterable) |
| `GET` | `/api/emissions` | Aggregated emissions by source & month |

### Challenges & Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/challenges` | List active challenges |
| `POST` | `/api/challenges/submit` | Submit challenge — auto-awards XP + badges |
| `GET` | `/api/badges` | List all badges with unlock rules |

### Rewards
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rewards` | List available rewards |
| `POST` | `/api/rewards/redeem` | Redeem reward (atomic transaction) |

### Departments & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/departments` | List departments |
| `GET` | `/api/departments/scores` | ESG scores + overdue compliance flags |
| `GET` | `/api/users` | User data (by ID or list all) |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/callback/credentials` | Login |
| `GET` | `/api/auth/session` | Current session + full user data |

---

## 🧠 Business Logic

### Auto Emission Calculation
```
calculatedEmissions = emissionFactor.factorValue × quantity
```
When creating a CarbonTransaction, the system fetches the linked EmissionFactor and multiplies automatically.

### Reward Redemption (Atomic)
```
BEGIN TRANSACTION
  → Check user.availablePoints >= reward.pointsRequired
  → Check reward.stockCount > 0
  → Decrement user.availablePoints
  → Decrement reward.stockCount
  → Create RewardRedemption record
COMMIT
```

### Badge Auto-Award
```
On challenge approved → Award XP → Evaluate ALL badge rules:
  • challenges_completed ≥ threshold → Unlock badge
  • total_xp ≥ threshold → Unlock badge
  • carbon_offset ≥ threshold → Unlock badge
If unlocked → Create UserBadge record
```

### ESG Score Calculation
```
totalScore = (environmentalScore × 0.4) + (socialScore × 0.3) + (governanceScore × 0.3)
```
Also flags departments with OPEN compliance issues past their due date.

---

## 📸 Screenshots

<div align="center">

### 🔐 Login
*Clean authentication with demo quick-login*

### 🎮 Gamification Hub
*Challenge cards, XP progress bar, badge gallery, rewards catalog*

### 📊 Executive Dashboard
*ESG radial dial, emissions trend chart, department leaderboard*

</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/Rakshit1236/EcoSphere-ESG-Management-Platform-Odoo-RS.git
cd EcoSphere-ESG-Management-Platform-Odoo-RS

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Push database schema
npx prisma db push

# Seed sample data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@ecosphere.com` | `password123` | Admin |
| `alex@ecosphere.com` | `password123` | Employee |
| `priya@ecosphere.com` | `password123` | Manager |
| `marcus@ecosphere.com` | `password123` | Employee |
| `elena@ecosphere.com` | `password123` | Employee |

---

## 🌟 Key Highlights

- **Zero hardcoded data** — All user data fetched dynamically from session + database
- **Type-safe** — Full TypeScript coverage with Prisma-generated types
- **Atomic transactions** — Reward redemption uses database transactions for data integrity
- **Auto-calculations** — Emission factors auto-compute CO₂e; badge rules auto-evaluate on XP gain
- **Dual-theme** — Light/dark mode with CSS custom properties and localStorage persistence
- **Responsive** — Mobile-first design, works on all screen sizes
- **Production-ready** — Clean build, no TypeScript errors, proper error handling

---

## 📄 License

MIT License © 2026

---

<div align="center">

**Built with 💚 for a sustainable future**

*Odoo Hackathon 2026*

</div>

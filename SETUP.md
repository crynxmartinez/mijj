# MIJJ - Project Tracking System Setup Guide

## Overview
Engineering project tracking system with budget management, transaction tracking, and reporting features.

## Environment Setup

### 1. Database Configuration (Prisma)

Create a `.env` file in the root directory with the following:

```env
DATABASE_URL="postgres://a307dbd9f9f131c66e2eb6ae7544bcd4715aa02dec90d2831cb631ef4ec1690c:sk_rVkexEGW7JSkm9a5hr9yv@db.prisma.io:5432/postgres?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Vercel Environment Variables

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following:

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `postgres://a307dbd9f9f131c66e2eb6ae7544bcd4715aa02dec90d2831cb631ef4ec1690c:sk_rVkexEGW7JSkm9a5hr9yv@db.prisma.io:5432/postgres?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL (e.g., `https://mijj.vercel.app`) |

### 3. Installation

```bash
npm install
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## GitHub Repository

Repository: https://github.com/crynxmartinez/mijj.git

## Deployment

The project is connected to Vercel and will auto-deploy on push to main branch.

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: PostgreSQL (Prisma.io)
- **ORM**: Prisma
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

## Features

- **Project Management**: Track multiple engineering projects
- **Phase Tracking**: Pre-bidding, Start, In Progress, Completion, Post-Project
- **Transaction Management**: Record all expenses with categories
- **Budget vs Actual**: Real-time budget comparison
- **Cost Categories**: Labor, Materials, Equipment, Subcontractor, Permits, Overhead
- **Payment Tracking**: Monitor payment status (pending, paid, overdue)
- **Dashboard**: Visual analytics with charts and metrics
- **Reporting**: Export capabilities for financial reports

## Project Structure

```
mijj/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
└── public/               # Static assets
```

## Support

For issues or questions, contact the development team.

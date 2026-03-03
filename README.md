# MIJJ - Project Tracking System

Engineering project tracking and budget management system for construction and engineering clients.

## Quick Start

### 1. Create `.env` file

Create a `.env` file in the root directory with:

```env
DATABASE_URL="postgres://a307dbd9f9f131c66e2eb6ae7544bcd4715aa02dec90d2831cb631ef4ec1690c:sk_rVkexEGW7JSkm9a5hr9yv@db.prisma.io:5432/postgres?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Setup Database

```bash
npx prisma db push
npx prisma generate
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Features

- **Multi-Phase Project Tracking**: Pre-bidding, Start, In Progress, Completion, Post-Project
- **Budget Management**: Track budget vs actual spending with visual charts
- **Transaction Tracking**: Record expenses by category (Labor, Materials, Equipment, etc.)
- **Payment Status**: Monitor pending, paid, and overdue payments
- **Dashboard Analytics**: Real-time insights and budget utilization metrics
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma + PostgreSQL
- shadcn/ui + Tailwind CSS
- Recharts for data visualization

## Deployment

Connected to Vercel via GitHub. Pushes to main branch auto-deploy.

See [SETUP.md](./SETUP.md) for detailed setup instructions.

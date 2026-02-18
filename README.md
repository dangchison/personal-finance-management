# 💰 Personal Finance Management

A modern, full-stack personal finance management application built with Next.js 16, featuring real-time transaction tracking, budget management, and comprehensive financial analytics for both personal and family finances.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics**: View your financial overview at a glance
- **Interactive Charts**: Monthly trends, category breakdowns, and yearly comparisons
- **Budget Tracking**: Monitor spending against set budgets with visual progress indicators
- **Recent Transactions**: Quick access to latest financial activities

### 💸 Transaction Management
- **Dual Scope**: Separate personal and family transaction tracking
- **Smart Filtering**: Filter by category, family member, and date range
- **Virtualized Lists**: High-performance rendering with `react-window` for large datasets
- **CRUD Operations**: Full create, read, update, and delete capabilities
- **Responsive Design**: Optimized for both desktop (Dialog) and mobile (Sheet) interfaces

### 📈 Analytics & Reports
- **Daily/Monthly Charts**: Visualize spending patterns over time
- **Category Analysis**: Pie charts showing expense distribution
- **Yearly Comparisons**: Track financial growth year-over-year
- **Custom Date Ranges**: Filter reports by specific time periods

### 👨‍👩‍👧‍👦 Family Management
- **Multi-user Support**: Add and manage family members
- **Shared Finances**: Track family expenses separately from personal ones
- **Member-specific Filtering**: View transactions by individual family members

### 🔐 Authentication & Security
- **NextAuth.js Integration**: Secure authentication system
- **Credential Provider**: Email/password authentication
- **Protected Routes**: Server-side session validation
- **Password Hashing**: Bcrypt encryption for user credentials

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Virtualization**: [react-window](https://github.com/bvaughn/react-window)
- **Date Handling**: [date-fns](https://date-fns.org/)

### Backend
- **Database**: PostgreSQL (Neon)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **API**: Next.js Server Actions & API Routes

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (local or cloud-hosted)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dangchison/personal-finance-management.git
   cd personal-finance-management
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3008"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Initialize the database**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3008](http://localhost:3008)

## 🗂️ Project Structure

```
personal-finance-management/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── actions/              # Server actions
│   │   ├── analytics.ts      # Analytics queries
│   │   ├── budget.ts         # Budget operations
│   │   ├── family.ts         # Family management
│   │   └── transaction.ts    # Transaction CRUD
│   ├── app/                  # Next.js app router
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Dashboard page
│   │   ├── family/          # Family management page
│   │   ├── reports/         # Analytics page
│   │   ├── transactions/    # Transactions page
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── budget/         # Budget components
│   │   ├── charts/         # Chart components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── reports/        # Report components
│   │   ├── transaction/    # Transaction components
│   │   └── ui/             # Reusable UI components (shadcn/ui)
│   ├── hooks/              # Custom React hooks
│   │   └── useUrlFilters.ts # URL-based filter state management
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── db.ts           # Prisma client
│   │   ├── format-currency.ts # Currency formatting utilities
│   │   └── utils.ts        # General utilities
│   └── styles/             # Global styles
└── package.json
```

## 🎯 Key Features Implementation

### DRY Principles & Code Quality
The codebase follows **Don't Repeat Yourself (DRY)** principles with:
- **Reusable Hooks**: `useUrlFilters` for centralized filter state management
- **Utility Functions**: `format-currency.ts` for consistent currency formatting
- **Component Abstraction**: `QuickActionButton` for dashboard actions
- **~100+ lines of duplicate code eliminated** through refactoring

### Performance Optimizations
- **Virtualized Lists**: Using `react-window` for rendering 1000+ transactions efficiently
- **Server Components**: Leveraging Next.js 16 Server Components for faster initial loads
- **Turbopack**: Lightning-fast development with Next.js Turbopack
- **Code Splitting**: Automatic route-based code splitting
- **Optimized Images**: Next.js Image optimization for avatars and media

### Responsive Design
- **Mobile-First**: Fully responsive layouts for all screen sizes
- **Adaptive UI**: Dialog components on desktop, Sheet components on mobile
- **Touch-Optimized**: Mobile-friendly interactions and gestures

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server (port 3008)

# Production
pnpm build        # Create production build
pnpm start        # Start production server

# Database
pnpm prisma generate    # Generate Prisma client
pnpm prisma db push     # Push schema to database
pnpm prisma studio      # Open Prisma Studio

# Linting
pnpm lint         # Run ESLint
```

## 🗄️ Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Category**: Transaction categories (income/expense)
- **Transaction**: Financial transactions
- **Budget**: Budget limits by category
- **Member**: Family member profiles

See `prisma/schema.prisma` for the complete schema definition.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean
- AWS Amplify

## 🛠️ Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)

### Database Migrations
```bash
# Create a new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Dang Chi Son**
- GitHub: [@dangchison](https://github.com/dangchison)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Component Library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

**Built with ❤️ using Next.js 16 and TypeScript**

** Happy New Year 2026 **
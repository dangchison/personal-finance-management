# Personal Finance Management

Ứng dụng quản lý tài chính cá nhân/gia đình xây dựng bằng Next.js 16 + Prisma + NextAuth.

- Ghi chép giao dịch nhanh
- Theo dõi ngân sách theo danh mục
- Báo cáo và xu hướng chi tiêu
- Tách phạm vi `personal` / `family`
- Danh sách giao dịch tối ưu bằng virtual scroll (`react-window`)

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui + Radix UI
- Prisma + PostgreSQL
- NextAuth (Credentials Provider)
- Vitest (unit tests)

## Tính năng chính

### Dashboard
- Layout command-center hiện đại
- Luôn hiển thị giao dịch của **tháng hiện tại**
- Filter theo scope/category/member
- Insights ngân sách và phân bổ chi tiêu

### Transactions
- CRUD giao dịch (Dialog desktop / Sheet mobile)
- Lọc theo category, member, date
- Virtualized list với `react-window`

### Reports
- Tổng hợp theo khoảng ngày
- Phân tích theo danh mục
- Trend 6 tháng gần nhất

### Family
- Tạo/tham gia nhóm gia đình
- Chia sẻ và theo dõi giao dịch chung

### Settings
- Quản lý ngân sách
- Quản lý danh mục hệ thống (Admin)

### Auth & Routing Guard
- Đã đăng nhập vào `/login` hoặc `/register` sẽ tự redirect về `/dashboard`
- Chưa đăng nhập vào route private sẽ redirect về `/login?callbackUrl=...`
- Route guard chạy ở `src/proxy.ts`

## Cài đặt

### 1) Yêu cầu
- Node.js 18+
- pnpm
- PostgreSQL

### 2) Cài dependencies
```bash
pnpm install
```

### 3) Tạo file `.env`
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"
DIRECT_URL="postgresql://user:password@host:port/dbname"

# Auth
NEXTAUTH_URL="http://localhost:3008"
NEXTAUTH_SECRET="your-secret"

# Optional: seed admin
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_USERNAME="admin"
SEED_ADMIN_PASSWORD="strong-password"
```

### 4) Khởi tạo database
```bash
pnpm prisma db push
pnpm prisma db seed
```

### 5) Chạy dev
```bash
pnpm dev
```

App chạy tại [http://localhost:3008](http://localhost:3008).

## Scripts

```bash
pnpm dev          # chạy dev server (port 3008)
pnpm build        # build production
pnpm start        # chạy production (port 3008)
pnpm lint         # eslint
pnpm test         # vitest run
pnpm test:watch   # vitest watch
```

## Cấu trúc thư mục

```text
src/
├── actions/                 # Server Actions
├── app/                     # App Router pages
│   ├── dashboard/
│   ├── transactions/
│   ├── reports/
│   ├── family/
│   ├── settings/
│   ├── login/
│   └── register/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── transaction/
│   ├── reports/
│   ├── family/
│   ├── budget/
│   ├── admin/
│   ├── layout/              # workspace-layout
│   └── ui/
├── hooks/
├── lib/
│   ├── app-time.ts          # helper ngày/tháng (timezone app)
│   ├── analytics-time.ts    # helper bucket analytics
│   ├── scope-users.ts       # helper scope personal/family
│   ├── auth.ts
│   └── prisma.ts
└── proxy.ts                 # route guard cho auth/private routes
```

## Kiểm thử

- Unit tests đang có cho:
  - `src/lib/app-time.test.ts`
  - `src/lib/analytics-time.test.ts`

Chạy:
```bash
pnpm test
```

## Ghi chú

- Seed admin không còn hardcode; dùng biến môi trường `SEED_ADMIN_*`.
- Một số logic date/range dùng helper tập trung trong `src/lib/app-time.ts`.
- Nếu môi trường build không có network outbound, tải Google Fonts có thể fail khi `pnpm build`.

## License

MIT

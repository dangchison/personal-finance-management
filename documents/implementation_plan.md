# Implementation Plan - Personal Finance System

## Goal Description
Build a secure, multi-user personal finance management system that allows individuals and families to track daily expenses, view monthly summaries, compare spending across months, and set budget alerts.

## User Review Required
> [!IMPORTANT]
> Please review the proposed Technology Stack and Database Schema below.

## Proposed Technology Stack
- **Language**: TypeScript (Full-stack)
- **Framework**: Next.js 14+ (App Router)
    - Provides both Frontend (React) and Backend (API Routes/Server Actions).
- **Styling**: Tailwind CSS
- **UI Framework/Components**: **Shadcn UI** (dựa trên Radix UI).
    - *Lý do*: Giao diện hiện đại, đẹp, tối giản, UX rất tốt và dễ tùy biến.
- **Icons**: Lucide React
- **Charts**: Recharts (để vẽ biểu đồ báo cáo).
- **Database**: PostgreSQL (via **Supabase**)
    - *Lý do*: Supabase cung cấp PostgreSQL miễn phí, bảo mật cao, có sẵn Authentication và quản lý user rất tốt. Không lo mất dữ liệu như lưu file local.
- **Authentication**: NextAuth.js (v4)
    - *Chiến lược*: JWT (JSON Web Token) được lưu trữ an toàn trong **Cookies**.
    - *Thời hạn phiên*: 10 phút (tự động logout để đảm bảo an toàn tài chính).
- **Cấu hình môi trường**:
    - Hỗ trợ biến `PORT` trong `.env` để chạy trên port tùy chỉnh (ví dụ: 3008).

## Proposed UI/Page Structure

### 1. Mobile-First & Responsive Design
- Ứng dụng sẽ được thiết kế **Mobile-First**: Tối ưu hoàn toàn cho điện thoại để bạn có thể nhập chi tiêu ngay khi vừa mua sắm.
- Hiển thị tốt trên mọi thiết bị: Mobile, Tablet, Desktop.
- Sử dụng các UI pattern thân thiện mobile: Drawer (vuốt từ dưới lên), Navbar cố định ở dưới (bottom navigation) cho mobile.

### 2. Public / Auth
- `/login`: Form đăng nhập.
- `/register`: Form đăng ký.
- `/`: Landing page (hoặc redirect thẳng vào `/dashboard` nếu đã login).

### 2. Dashboard (`/dashboard`)
Đây là màn hình chính sau khi login:
- **Header**: Hiển thị tổng chi tiêu tháng này.
- **Budget Status**: Thanh tiến độ hiển thị % ngân sách đã dùng (Cảnh báo đỏ nếu vượt).
- **Recent Transactions**: List 5-10 giao dịch gần nhất trong ngày.
- **Quick Add**: Nút "+ Mới" nổi bật để thêm nhanh chi tiêu.

### 3. Transactions (`/transactions`)
- Hiển thị danh sách toàn bộ chi tiêu.
- **Filter**: Lọc theo Tháng, Theo Category, Theo Người (trong gia đình).
- **Action**: Bấm vào item để Edit/Delete.

### 4. Analysis / Reports (`/reports`)
- **Chart**: Biểu đồ cột so sánh chi tiêu Tháng này vs Tháng trước.
- **Pie Chart**: Cơ cấu chi tiêu theo Danh mục (Ăn uống, Đi lại...).
- **Insight**: Text ngắn gọn "Tháng này bạn đã tiêu nhiều hơn tháng trước 15%".

### 5. Settings & Family
- `/budgets`: Cài đặt hạn mức chi tiêu (Tổng hoặc từng danh mục).
- `/family`:
    - Hiển thị danh sách thành viên.
    - Button "Mời thành viên" -> Tạo Invite Code/Link.
- `/profile`: Đổi tên, mật khẩu, avatar.

## Database Schema Design

### `User`
- `id`: String (UUID)
- `email`: String (Unique)
- `passwordHash`: String
- `name`: String
- `familyId`: String (Nullable, Foreign Key to Family)
- `role`: Enum (ADMIN, MEMBER)

### `Family`
- `id`: String (UUID)
- `name`: String
- `code`: String (Unique invite code)

### `Transaction`
- `id`: String (UUID)
- `amount`: Decimal
- `description`: String
- `date`: DateTime
- `type`: Enum (INCOME, EXPENSE)
- `userId`: String (Foreign Key to User)
- `categoryId`: String (Foreign Key to Category)
- `createdAt`: DateTime

### `Category`
- `id`: String (UUID)
- `name`: String (e.g., Food, Transport, Utilities)
- `type`: Enum (INCOME, EXPENSE)
- `isDefault`: Boolean (System defaults vs User defined)
- `familyId`: String (Nullable - if custom category for family)

### `Budget`
- `id`: String (UUID)
- `amount`: Decimal
- `month`: Int
- `year`: Int
- `userId`: String (Nullable)
- `familyId`: String (Nullable)
- *Note*: Allows setting budgets per user or per family.

## Detailed Technical Implementation

### Phase 1: Soft Delete & Core Refactor
#### [MODIFY] [schema.prisma](file:///Users/son.dc/Desktop/Projects/personal/prisma/schema.prisma)
- Add `updatedAt` and `deletedAt` (nullable) to `Transaction` model.
- Run `npx prisma migrate dev`.

#### [MODIFY] [transaction.ts](file:///Users/son.dc/Desktop/Projects/personal/src/actions/transaction.ts)
- `getTransactions`: Add `where: { deletedAt: null }` context to filter out deleted items.
- `getMonthlyStats`: Add `where: { deletedAt: null }` to aggregation.
- `deleteTransaction(id)`: Perform Soft Delete -> `update({ where: { id }, data: { deletedAt: new Date() } })`.
- `updateTransaction(id, data)`: Standard update.

### Phase 2: Family Management & Shared Tracking
#### [NEW] [family.ts](file:///Users/son.dc/Desktop/Projects/personal/src/actions/family.ts)
- `createFamily(name)`: Create family, set creator as Admin. Update User's `familyId`.
- `joinFamily(inviteCode)`: Find family by code, update User's `familyId`.
- `leaveFamily()`: Clear User's `familyId`.
- `getFamilyMembers()`: Helper to fetch id and names for filters.

#### [MODIFY] [transaction.ts](file:///Users/son.dc/Desktop/Projects/personal/src/actions/transaction.ts)
- `getTransactions`: Accept `filters`: `{ scope, startDate, endDate, categoryId, memberId }`.
- Verify family membership for shared scope queries.

#### [MODIFY] [dashboard-client.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/components/dashboard/dashboard-client.tsx)
- Integrate Family/Personal tabs and filters.
- Improve mobile responsiveness (full-width inputs).

#### [MODIFY] [transaction-list.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/components/transaction/transaction-list.tsx)
- Add `readOnly` support for family transactions.
- Implement virtualized list for dashboard view.
- Fix mobile layout for empty states.

### Phase 3: Transactions Page & Advanced Filters
#### [MODIFY] [transactions/page.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/app/transactions/page.tsx)
- Support full filtering parameters via `searchParams`.
- Fetch `familyMembers` for the filter dropdowns.

#### [MODIFY] [transactions-client.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/components/transaction/transactions-client.tsx)
- Implement full-page layout (no scroll limit).
- Add top progress bar for filter/navigation changes.
- Responsive calendar (1 month on mobile, 2 on desktop).

## Verification Plan

### Automated Tests
- Integration tests for API routes (simulating login and CRUD).

### Manual Verification
- **Login Flow**: Verify user can sign up and login.
- **Transaction**: Add an expense, verify it appears in dashboard.
- **Family**: Create a second user, link to same family, verify mutual visibility.
- **Budget Alert**: Set a low budget, add high expense, verify UI warning.
- **Mobile responsiveness**: Verify all filters and lists look good on 375px width.

## Deployment Strategy
- **Platform**: **Vercel**
    - *Lý do*: Được tối ưu tốt nhất cho Next.js, Free Tier thoải mái cho dự án cá nhân/gia đình.
    - CI/CD tự động: Chỉ cần push code lên GitHub là tự deploy.
- **Environment Variables**: Cần cấu hình các key kết nối Supabase và NextAuth Secret trên Vercel Dashboard.

## Sprint Planning

### Sprint 1: Foundation & Personal Tracking (MVP)
*Mục tiêu: Người dùng có thể chạy được app, đăng nhập và ghi chép chi tiêu cá nhân cơ bản.*
- [x] Khởi tạo Project, cài đặt Shadcn UI, Prisma.
- [x] Kết nối Database Supabase.
- [x] Chức năng Authentication (Đăng nhập/Đăng ký).
- [x] Chức năng CRUD Transaction: Thêm, Xem list, Xóa giao dịch.
- [x] Dashboard cơ bản: Xem tổng tiền tháng này.

### Sprint 2: Family & Sharing
*Mục tiêu: Mở rộng cho gia đình cùng dùng và đưa lên Online.*
- [x] Logic Family: Tạo nhóm, mời thành viên (Invite Code).
- [x] Data Privacy: Đảm bảo chỉ người cùng nhà mới xem được của nhau.
- [x] Deploy lên Vercel để chạy thực tế.
- [x] Cải thiện UI transaction: Filter, Search, Mobile Responsive.

### Sprint 3: Analysis & Budgets
*Mục tiêu: Báo cáo thông minh và kiểm soát chi tiêu.*
- [ ] Chức năng đặt hạn mức ngân sách (Budget).
- [ ] Cảnh báo khi vượt quá chi tiêu.
- [ ] Vẽ biểu đồ (Reports) so sánh các tháng.
- [ ] Hoàn thiện UI/UX, responsive mobile.

# Personal Finance Management - Release 1.0 Implementation Plan

## Goal Description
Build and release a comprehensive Personal Finance Management application with "Family" sharing capabilities.
This plan tracks the implemented features, covering the original Minimum Viable Product (MVP) scope through to the final polish and bug fixes.

## User Review Required
> [!IMPORTANT]
> This document reflects the final state of the application for Release 1.0, including recent critical fixes and UI enhancements.

## Implemented Architecture & Features

### 1. Core Architecture & Authentication
**Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Supabase (PostgreSQL), Prisma.
- **Authentication**: `next-auth` (v5 beta) with Prisma Adapter.
    - [x] Login/Register with Credentials.
    - [x] Route Protection Middleware.
    - [x] User Extensions (Username, Settings).

### 2. Transaction Management (Personal)
- **Database**: `Transaction` model with support for recurring/one-time types.
- **UI**:
    - [x] **Add/Edit Transaction**: Mobile-responsive form with "Income/Expense" toggle.
    - [x] **Transaction List**: Virtualized or paginated list of history.
    - [x] **Dashboard**: Summary cards (Income vs Expense).

### 3. Family & Sharing Mechanics
- **Database**: `Family` model, `FamilyMember` linking Users. `Transaction` has optional `familyId`.
- **Logic**:
    - [x] **Invite System**: Generate invite codes/links.
    - [x] **Shared View**: Toggle between "Personal" and "Family" scopes on Dashboard/History.
    - [x] **Permissions**: Members can view/edit family transactions based on roles (Admin/Member).

### 4. Budgeting & Planning
**Ref**: [Conversation: Debugging Budget Save Error]
- **Database**: `Budget` model linked to `Category` and `User` (or `Family`).
- **Features**:
    - [x] **Budget Setting**: UI to set monthly limits per category.
    - [x] **Progress Tracking**: Visual progress bars showing spend vs limit.
    - **[FIX] Budget Save Authorization**:
        - Resolved `Unauthorized` errors in `src/actions/budget.ts`.
        - Fixed session validation logic in `src/lib/auth-helpers.ts` to ensure reliable user identification during server actions.

### 5. Reports & Analytics
**Ref**: [Conversation: Improving Reports Chart UI]
- **Library**: `recharts` for visualization.
- **Features**:
    - [x] **Reports Page**: Dedicated `/reports` route.
    - [x] **Monthly Comparison**: Line/Area chart comparing income/expense over time.
    - [x] **Category Breakdown**: Pie/Donut chart of spending distribution.
    - **[ENHANCEMENT] Chart UI Polish**:
        - Upgraded Line Chart to **Area Chart** with gradient fills (`defs` in Recharts).
        - Improved Tooltip styling (glassmorphism effect).
        - Enhanced Axis styling (custom tick formatters, simplified grids).

### 6. UI Structure & Polish
- **Navigation**:
    - [x] Bottom Nav (Mobile) / Sidebar or Header (Desktop).
    - [x] Quick Actions (Floating Action Button).
- **Pages Reorganization**:
    - [x] `/dashboard`: Main summary.
    - [x] `/reports`: Detailed analytics.
    - [x] `/settings`: Budget & Profile management.
- **Theming**:
    - [x] Dark/Light mode support.
    - [x] Consistent color palette (Slate/Blue/Red/Green) for financial data.

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npm run build` to ensure type safety.

### Manual Verification Checklist
1.  **Authentication**:
    - [ ] Sign up new user -> Login -> Logout.
2.  **Budget Flow (Critical)**:
    - [ ] Go to Settings -> Budget.
    - [ ] Add a new budget for a category.
    - [ ] **Verify**: Save successful (No "Unauthorized" error).
3.  **Reports Visualization**:
    - [ ] Go to Reports page.
    - [ ] Check Monthly Trend chart.
    - [ ] **Verify**: Chart uses Gradient Area style, tooltip appears on hover.
4.  **Family Sharing**:
    - [ ] Switch context to Family.
    - [ ] Verify transactions filter by family correctly.

---

# Release 1.1: Admin Feature Implementation Plan - CRUD Category

## Goal
Implement a feature allowing users with the `ADMIN` role to manage System Categories (CRUD). Regular users should only see these categories but cannot modify them.

## User Review Required
> [!IMPORTANT]
> **Authentication Update**: We need to modify `src/lib/auth.ts` to include the user's `role` in the session object. This allows the frontend and backend to easily verify permissions.

> [!NOTE]
> **Scope**: Admin CRUD will strictly operate on **System Categories** (where `isDefault = true` and `familyId = null`). User-custom categories (linked to families) are largely separate from this specific admin tool, though visible in the database.

## Proposed Changes

### 1. Authentication & Role Exposure
Update NextAuth configuration to persist the user role from database -> JWT -> Session.

#### [MODIFY] [auth.ts](file:///Users/sondc/Desktop/projects/personal-finance-management/src/lib/auth.ts)
- Update `callbacks`:
    - `jwt`: Fetch user role and add to token.
    - `session`: Add role to `session.user`.
- Update Types or extend Session interface.

### 2. Backend Logic (Server Actions)
Create secure server actions for Category management.

#### [NEW] [admin.ts](file:///Users/sondc/Desktop/projects/personal-finance-management/src/actions/admin.ts)
- `getSystemCategories()`: Fetch all categories where `isDefault: true`.
- `createSystemCategory(data)`: Create new category, force `isDefault: true`, `familyId: null`. Check `session.user.role === 'ADMIN'`.
- `updateSystemCategory(id, data)`: Update name/type. Check `session.user.role === 'ADMIN'`.
- `deleteSystemCategory(id)`: Delete category. **Constraint**: Handle cases where transactions exist (soft delete or prevent delete). For now, we will prevent delete if transactions exist.

### 3. Frontend Implementation (Admin UI)
Create a new Admin Layout and Category Management Page.

#### [NEW] [layout.tsx](file:///Users/sondc/Desktop/projects/personal-finance-management/src/app/admin/layout.tsx)
- Define a layout specifically for `/admin` routes.
- Check role in layout (double security). If not Admin -> Redirect to dashboard.
- Add an "Admin Sidebar" or Navigation.

#### [NEW] [page.tsx](file:///Users/sondc/Desktop/projects/personal-finance-management/src/app/admin/categories/page.tsx)
- The main management view.

#### [NEW] [category-table.tsx](file:///Users/sondc/Desktop/projects/personal-finance-management/src/components/admin/category-table.tsx)
- Uses `shadcn/ui` Table.
- Columns: Name, Type (Income/Expense), Actions (Edit, Delete).

#### [NEW] [category-dialog.tsx](file:///Users/sondc/Desktop/projects/personal-finance-management/src/components/admin/category-dialog.tsx)
- Modal form for Creating and Editing categories.

### 4. Middleware (Optional but Recommended)
#### [MODIFY] [middleware.ts](file:///Users/sondc/Desktop/projects/personal-finance-management/src/middleware.ts)
- Ensure `/admin` routes are protected. (Currently we usually do this per-page or in layout for App Router, but middleware is good for broad protection).

## Verification Plan

### Manual Verification
1.  **Login as Member**:
    - Try to navigate to `/admin/categories`.
    - Expect: Redirect to `/dashboard` or 403 Access Denied.
2.  **Login as Admin (admin / Abcd@1234)**:
    - Navigate to `/admin/categories`.
    - **Create**: Add "Luong Thuong" (Income). Verify it appears. check DB `isDefault: true`.
    - **Read**: See list of existing default categories.
    - **Update**: Rename "Luon Thuong" to "Salary Bonus". Verify change.
    - **Delete**: Delete the new category. Verify removal.

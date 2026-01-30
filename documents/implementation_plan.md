# Implementation Plan - Sprint 3: Budgets & Analysis

## Goal Description
Implement budgeting features to allow users/families to set spending limits. Add visual analytics (charts) to visualize income, expenses, and budget progress.

## User Review Required
- **Schema**: New `Budget` model linked to `Category` and `User`/`Family`.
    - *Decision*: Budget is per Category or Global? Usually per Category + Global. Let's start with **Per Category Budget**.
    - *Timeframe*: Monthly by default.

## Proposed Changes

### Database
#### [MODIFY] [schema.prisma](file:///Users/son.dc/Desktop/Projects/personal/prisma/schema.prisma)
- Add `Budget` model:
    ```prisma
    model Budget {
      id          String   @id @default(uuid())
      amount      Decimal
      categoryId  String
      category    Category @relation(fields: [categoryId], references: [id])
      userId      String // Creator/Owner
      user        User     @relation(fields: [userId], references: [id])
      familyId    String? 
      family      Family?  @relation(fields: [familyId], references: [id])
      period      String   @default("monthly") // "monthly"
      createdAt   DateTime @default(now())
      updatedAt   DateTime @updatedAt
      
      @@unique([categoryId, userId, familyId]) // Prevent duplicate budgets for same category
    }
    ```

### Server Actions
#### [NEW] [budget.ts](file:///Users/son.dc/Desktop/Projects/personal/src/actions/budget.ts)
- `upsertBudget(categoryId, amount)`: Create or update budget.
- `getBudgets()`: Fetch all budgets for current scope.
- `getBudgetProgress()`: Calculate (Spent / Budget) * 100 per category.

### UI Components
#### [NEW] [budget-list.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/components/budget/budget-list.tsx)
- List current budgets.
- Edit budget amount inline or via dialog.

#### [NEW] [budget-progress.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/components/budget/budget-progress.tsx)
- Visual progress bar (Shadcn `Progress`).
- Color coding: Green (<80%), Yellow (80-100%), Red (>100% - Over budget).

#### [MODIFY] [dashboard/page.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/app/dashboard/page.tsx)
- Add "Budgets" section/card.
- Display top over-budget categories.

### Analytics (Recharts)
#### [NEW] [charts/monthly-chart.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/components/charts/monthly-chart.tsx)
- Bar chart: Income vs Expense per day/week.

#### [NEW] [charts/category-pie.tsx](file:///Users/son.dc/Desktop/Projects/personal/src/components/charts/category-pie.tsx)
- Pie chart: Expense distribution by category.

## Verification Plan
1.  **Budget Setting**: Set budget for "Food".
2.  **Tracking**: Add "Food" expense. Check if budget progress bar updates.
3.  **Visualization**: Check Dashboard charts accurately reflect transactions.

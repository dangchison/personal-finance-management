import { revalidatePath } from "next/cache";

/**
 * Revalidate common transaction-related pages
 */
export function revalidateTransactionPages() {
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
}

/**
 * Revalidate dashboard page
 */
export function revalidateDashboard() {
  revalidatePath("/dashboard");
}

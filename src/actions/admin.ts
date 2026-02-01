"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Helper to ensure current user is Admin
 */
async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
    return session.user;
}

/**
 * Get all system categories (isDefault = true)
 */
export async function getSystemCategories() {
    await requireAdmin();
    try {
        const categories = await prisma.category.findMany({
            where: {
                isDefault: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return categories;
    } catch (error) {
        console.error("Error fetching system categories:", error);
        return [];
    }
}

/**
 * Create a new system category
 */
export async function createSystemCategory(data: { name: string; type: TransactionType }) {
    await requireAdmin();

    if (!data.name || !data.type) {
        throw new Error("Missing required fields");
    }

    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                type: data.type,
                isDefault: true,
                familyId: null, // System categories don't belong to any family
            },
        });

        revalidatePath("/settings");
        return { success: true, data: category };
    } catch (error) {
        console.error("Error creating system category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

/**
 * Update a system category
 */
export async function updateSystemCategory(id: string, data: { name: string; type: TransactionType }) {
    await requireAdmin();

    try {
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                type: data.type,
            },
        });

        revalidatePath("/settings");
        return { success: true, data: category };
    } catch (error) {
        console.error("Error updating system category:", error);
        return { success: false, error: "Failed to update category" };
    }
}

/**
 * Delete a system category
 */
export async function deleteSystemCategory(id: string) {
    await requireAdmin();

    try {
        // Check if transactions use this category
        const transactionCount = await prisma.transaction.count({
            where: { categoryId: id },
        });

        if (transactionCount > 0) {
            return {
                success: false,
                error: `Cannot delete category: It is used by ${transactionCount} transactions.`
            };
        }

        await prisma.category.delete({
            where: { id },
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("Error deleting system category:", error);
        return { success: false, error: "Failed to delete category" };
    }
}

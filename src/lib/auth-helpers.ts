import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get the authenticated user from the current session
 * @throws Error if user is not authenticated
 * @returns User ID and basic info
 */
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  if (!userId) {
    throw new Error("User ID not found");
  }

  return {
    id: userId,
    email: session.user.email || null,
    name: session.user.name || null,
  };
}

/**
 * Get the authenticated user or return null if not authenticated
 * Use this for optional authentication
 */
export async function getAuthenticatedUserOrNull() {
  try {
    return await getAuthenticatedUser();
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

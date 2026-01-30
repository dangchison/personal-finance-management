/**
 * Common Prisma select patterns to avoid duplication
 */

export const USER_SELECT = {
  id: true,
  name: true,
  image: true,
  email: true,
} as const;

export const USER_SELECT_BASIC = {
  id: true,
  name: true,
  image: true,
} as const;

export const FAMILY_WITH_USERS_SELECT = {
  include: {
    users: {
      select: USER_SELECT,
    },
  },
} as const;

import { z } from "zod";

export const userRoles = ["user", "mod", "admin", "foru"] as const;

export const UserRoleSchema = z.enum(userRoles);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserFacingUserSchema = z.object({
  email: z.string(),
  emailVerified: z.boolean(),
  joinedAt: z.string(),
  storageLimitMB: z.number(),
  role: UserRoleSchema,
});

export type UserFacingUser = z.infer<typeof UserFacingUserSchema>;

import { z } from "zod";

export const AccountProfileDataSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  links: z.array(
    z.object({
      url: z.string(),
      title: z.string(),
    })
  ),
  birthday: z.string().optional(), // ISO date string
});

export type AccountProfileData = z.infer<typeof AccountProfileDataSchema>;

export const UserFacingAccountSchema = z.object({
  id: z.string(),
  handle: z.string(),
  avatarUrl: z.string().optional(),
  profileData: AccountProfileDataSchema.optional(),
  joinedAt: z.string(),
});

export type UserFacingAccount = z.infer<typeof UserFacingAccountSchema>;

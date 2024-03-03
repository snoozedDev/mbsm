import { z } from "zod";
import { ImageSchema } from "./image";

export const AccountProfileDataSchema = z.object({
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

export const UserAccountSchema = z.object({
  avatar: ImageSchema.nullable(),
  handle: z.string(),
});

export type UserAccount = z.infer<typeof UserAccountSchema>;

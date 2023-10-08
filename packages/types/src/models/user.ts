import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";
import { ImageSchema } from "./post";

// SCHEMAS

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  username: z.string(),
  avatar: ImageSchema,
  bio: z.string().optional(),
  links: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .array()
    .optional(),
  nsfw: z.boolean().optional(),
  joinedAt: z.string(),
});

export const UserPreferencesSchema = z.object({
  theme: z.union([z.literal("light"), z.literal("dark"), z.literal("system")]),
  nsfw: z.union([
    z.literal("removed"),
    z.literal("hidden"),
    z.literal("shown"),
  ]),
  currentAccount: z.string().optional(),
});

// TYPES
export type User = z.infer<typeof UserSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

// TYPE GUARDS
export const isUser = getZodTypeGuard(UserSchema);
export const isUserPreferences = getZodTypeGuard(UserPreferencesSchema);

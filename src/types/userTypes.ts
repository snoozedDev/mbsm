import { getZodTypeGuard } from "@/utils/zodUtils";
import { z } from "zod";
import { ImageSchema } from "./postTypes";

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

// TYPES
export type User = z.infer<typeof UserSchema>;

// TYPE GUARDS
export const isUser = getZodTypeGuard(UserSchema);

import { z } from "zod";

export const UserAccountSchema = z.object({
  handle: z.string(),
});

export type UserAccount = z.infer<typeof UserAccountSchema>;

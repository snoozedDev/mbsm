import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

export const TokenSchema = z.object({
  user: z.object({
    username: z.string(),
    id: z.number(),
  }),
  userAgent: z.string(),
  level: z.union([z.literal("user"), z.literal("admin")]),
});

export const isToken = getZodTypeGuard(TokenSchema);

export type Token = z.infer<typeof TokenSchema>;

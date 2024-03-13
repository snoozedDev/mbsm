import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

export const TokenSchema = z.object({
  user: z.object({
    id: z.string(),
    emailVerified: z.boolean(),
  }),
});

export const isToken = getZodTypeGuard(TokenSchema);

export type Token = z.infer<typeof TokenSchema>;

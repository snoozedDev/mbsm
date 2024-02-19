import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

export const TokenSchema = z.object({
  user: z.object({
    id: z.string(),
  }),
});

export const isToken = getZodTypeGuard(TokenSchema);

export type Token = z.infer<typeof TokenSchema>;

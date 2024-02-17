import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

export const TokenSchema = z.object({
  iss: z.string(),
  sub: z.string(),
  aud: z.string(),
});

export const isToken = getZodTypeGuard(TokenSchema);

export type Token = z.infer<typeof TokenSchema>;

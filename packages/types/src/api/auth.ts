import { z } from "zod";
import { getZodTypeGuard } from "../zodUtils";

export const PostLoginVerifyBodySchema = z.object({
  attRes: z.any(),
});

export const isPostLoginVerifyBody = getZodTypeGuard(PostLoginVerifyBodySchema);

import { z } from "zod";
import { generateActionResponse } from "./utils";

export const UserMeResponseSchema = generateActionResponse({
  email: z.string(),
  emailVerified: z.boolean(),
});

export type UserMeResponse = z.infer<typeof UserMeResponseSchema>;

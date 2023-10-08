import { codeFormSchema } from "@/lib/shemas/forms/codeFormSchema";
import { ApiRoute } from "@/lib/validators/validatorUtils";
import { AuthenticatorSchema, InviteCodeSchema } from "@mbsm/types";
import { z } from "zod";

export const userRouter = {
  userInfo: new ApiRoute({
    method: "GET",
    route: "/user/info",
    responseBodySchema: z.object({
      email: z.string(),
      emailVerified: z.boolean(),
    }),
  }),
  userSettings: new ApiRoute({
    method: "GET",
    route: "/user/settings",
    responseBodySchema: z.object({
      authenticators: AuthenticatorSchema.array(),
      inviteCodes: InviteCodeSchema.array(),
    }),
  }),
  userEmailVerify: new ApiRoute({
    method: "POST",
    route: "/user/email/verify",
    requestBodySchema: codeFormSchema,
  }),
};

import { ApiRoute } from "@/lib/validators/validatorUtils";
import { z } from "zod";
import { userRouter } from "./userRouter";

export const routes = {
  processUserInviteCodesCron: new ApiRoute({
    method: "POST",
    route: "/crons/processUserInviteCodes",
    paramsSchema: z.object({
      code: z.string(),
    }),
  }),
  ...userRouter,
};

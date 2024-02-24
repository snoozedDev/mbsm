import { getEnvAsStr } from "@mbsm/utils";
import { appRouter } from "./appRouter";
import { createCallerFactory } from "./trpc";

export const serverClient = createCallerFactory(appRouter)({
  serverSecret: getEnvAsStr("SERVER_PROCEDURE_SECRET"),
});

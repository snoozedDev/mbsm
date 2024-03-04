import { authRouter } from "./routers/authRouter";
import { userRouter } from "./routers/userRouter";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  // serverOnly: serverProcedure.query(async () => {
  //   return "server only";
  // }),
});

export type AppRouter = typeof appRouter;

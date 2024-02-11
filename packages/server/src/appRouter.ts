import { userRouter } from "./routers/userRouter";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "ok";
  }),
  user: userRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

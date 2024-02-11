import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  me: publicProcedure.query(async ({ ctx: { user } }) => {
    if (user) {
      return {
        success: true,
        email: user.email,
        emailVerified: user.emailVerified,
      };
    }

    return {
      success: false,
      error: "Not authenticated",
    };
  }),
});

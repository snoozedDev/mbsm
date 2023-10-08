import { userRouter } from "@/server/routers/userRouter";
import { routeWithAuth } from "@/utils/tokenUtils";

export const GET = routeWithAuth({
  authRequired: true,
  routeValidator: userRouter.userInfo,
  handler: async ({ user }) => {
    console.log({ user });
    return {
      email: user.email,
      emailVerified: user.emailVerified === 1,
    };
  },
});

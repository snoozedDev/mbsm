import { routes } from "@/server/routers";
import {
  deleteEmailVerificationCode,
  getEmailVerificationCode,
} from "@/server/serverUtils";
import { routeWithAuth } from "@/utils/tokenUtils";
import { db, schema } from "@mbsm/db-layer";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = routeWithAuth({
  authRequired: true,
  routeValidator: routes.userEmailVerify,
  handler: async ({
    user,
    ctx: {
      body: { code },
    },
  }) => {
    if (user.emailVerified === 1) return "OK";

    let storedCode = await getEmailVerificationCode({ userId: user.id });

    if (
      !getEnvAsBool("IS_PROD") &&
      code === getEnvAsStr("DEV_VERIFICATION_CODE")
    ) {
      storedCode = code;
    }

    if (code !== storedCode?.toString()) {
      return new NextResponse("Verification code is invalid.", { status: 400 });
    }

    await Promise.all([
      db
        .update(schema.user)
        .set({ emailVerified: 1 })
        .where(eq(schema.user.id, user.id)),
      deleteEmailVerificationCode({ userId: user.id }),
    ]);

    return "OK";
  },
});

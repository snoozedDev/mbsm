import {
  authMiddleware,
  deleteEmailVerificationCode,
  getEmailVerificationCodeForUser,
  logAndReturnGenericError,
} from "@/server/serverUtils";
import { db, getUserByNanoId, schema } from "@mbsm/db-layer";
import {
  EmptyResponse,
  PostUserEmailVerifyBodySchema,
  getZodTypeGuard,
} from "@mbsm/types";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const userEmailVerify = async (
  req: NextRequest
): Promise<NextResponse<EmptyResponse>> => {
  const authRes = authMiddleware(req, true);
  if (authRes instanceof NextResponse) return authRes;

  const { token } = authRes;

  const body = await req.json();

  if (!getZodTypeGuard(PostUserEmailVerifyBodySchema)(body)) {
    return logAndReturnGenericError("Invalid body", "badRequest");
  }

  const { code } = body;

  const user = await getUserByNanoId(token.user.nanoId);

  if (!user) return logAndReturnGenericError("User not found", "unauthorized");

  let storedCode = await getEmailVerificationCodeForUser(user.id);

  if (!user) return logAndReturnGenericError("User not found", "unauthorized");

  if (user?.emailVerified) return NextResponse.json({ success: true });

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
      .set({ emailVerified: true })
      .where(eq(schema.user.id, user.id)),
    deleteEmailVerificationCode({ userId: user.id }),
  ]);

  return NextResponse.json({ success: true });
};

export { userEmailVerify as POST };

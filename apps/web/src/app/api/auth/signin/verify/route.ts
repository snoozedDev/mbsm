import { loginLimiter } from "@/server/rateLimit";
import { logAndReturnGenericError } from "@/server/serverUtils";
import { createAndSetAuthTokens } from "@/utils/tokenUtils";
import { getWebAuthnResponseForAuthentication } from "@/utils/webAuthnUtils";
import { db, schema } from "@mbsm/db-layer";
import { EmptyResponse, isPostAuthSignInVerifyBody } from "@mbsm/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest
): Promise<NextResponse<EmptyResponse>> => {
  const limitRes = await loginLimiter.middleware(req);
  if (limitRes) return limitRes;
  const userAgent = req.headers.get("user-agent");
  if (!userAgent) {
    return logAndReturnGenericError("No user agent found", "unauthorized");
  }
  const body = await req.json();

  if (!isPostAuthSignInVerifyBody(body)) {
    return logAndReturnGenericError("Invalid body", "badRequest");
  }

  const { attRes } = body;

  const [result] = await db
    .select()
    .from(schema.authenticator)
    .leftJoin(schema.user, eq(schema.user.id, schema.authenticator.userId))
    .where(eq(schema.authenticator.credentialId, attRes.id));

  if (!result) {
    return logAndReturnGenericError(
      "No authenticator found on DB",
      "unauthorized"
    );
  }

  const { user, authenticator } = result;

  if (!user) {
    return logAndReturnGenericError("No user found on DB", "unauthorized");
  }

  await db
    .update(schema.user)
    .set({ currentRegChallenge: null })
    .where(eq(schema.user.id, user.id));

  const verification = await getWebAuthnResponseForAuthentication({
    attRes,
    authenticator,
  });

  const { verified, authenticationInfo } = verification;

  if (!verified || !authenticationInfo) {
    return logAndReturnGenericError(
      "WebAuthn Verification failed",
      "unauthorized"
    );
  }

  const { newCounter } = authenticationInfo;

  await db
    .update(schema.authenticator)
    .set({ counter: newCounter })
    .where(eq(schema.authenticator.credentialId, authenticator.credentialId));

  const res = NextResponse.json({ success: true as const });

  await createAndSetAuthTokens(req, res, user);

  return res;
};

import { validateInviteCode } from "@/server/inviteCodeUtils";
import { registerLimiter } from "@/server/rateLimit";
import { generateEmailVerificationCodeAndSend } from "@/server/serverUtils";
import { getResponseWithTokens } from "@/utils/tokenUtils";
import { getWebAuthnResponseForRegistration } from "@/utils/webAuthnUtils";
import { db, schema } from "@mbsm/db-layer";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const limitRes = await registerLimiter.middleware(req);
  if (limitRes) return limitRes;
  const userAgent = req.headers.get("user-agent");
  if (!userAgent) return new NextResponse("Unauthorized", { status: 401 });
  const { attRes, email, inviteCode } = await req.json();

  const inviteCodeResponse = await validateInviteCode(inviteCode);
  if (inviteCodeResponse) return inviteCodeResponse;

  const [user] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, email));

  if (!user?.currentRegChallenge) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (user.protected) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const verification = await getWebAuthnResponseForRegistration({
    attRes,
    expectedChallenge: user.currentRegChallenge,
  });

  const { verified, registrationInfo } = verification;

  if (!verified) return new NextResponse("Unauthorized", { status: 401 });

  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialBackedUp,
    credentialDeviceType,
  } = registrationInfo!;

  const [response] = await Promise.all([
    getResponseWithTokens({
      req,
      user,
    }),
    generateEmailVerificationCodeAndSend({
      email,
      userId: user.id,
    }),
    db.insert(schema.authenticator).values({
      credentialId: Buffer.from(credentialID).toString("base64url"),
      credentialPublicKey:
        Buffer.from(credentialPublicKey).toString("base64url"),
      credentialBackedUp,
      credentialDeviceType,
      counter,
      userId: user.id,
      transports: [].join(","),
      name: nanoid(16),
    }),
    db
      .update(schema.user)
      .set({ currentRegChallenge: null, protected: true })
      .where(eq(schema.user.id, user.id)),
    db
      .update(schema.inviteCode)
      .set({ redeemed: true })
      .where(eq(schema.inviteCode.code, inviteCode)),
  ]);

  return response;
};

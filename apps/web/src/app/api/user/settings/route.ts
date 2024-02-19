import { authMiddleware, logAndReturnGenericError } from "@/server/serverUtils";
import { generateInviteCodes } from "@/utils/inviteCodeUtils";
import {
  getAuthenticatorsForUser,
  getUserByNanoId,
  getUserInviteCodes,
  insertInviteCodes,
} from "@mbsm/db-layer";
import {
  Authenticator,
  GetUserSettingsResponse,
  InviteCode,
} from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<GetUserSettingsResponse>> => {
  const authRes = authMiddleware(req, true);
  if (authRes instanceof NextResponse) return authRes;
  const { token } = authRes;

  const user = await getUserByNanoId(token.user.nanoId);

  if (!user) {
    return logAndReturnGenericError("No user found for token", "unauthorized");
  }

  let [authenticators, inviteCodes] = await Promise.all([
    getAuthenticatorsForUser(user.id),
    getUserInviteCodes(user.id),
  ]);

  let finalAuthenticators: Authenticator[] = authenticators.map(
    (authenticator) => ({
      credentialId: authenticator.credentialId,
      name: authenticator.name,
      addedAt: authenticator.createdAt.toISOString(),
    })
  );

  let finalInviteCodes: InviteCode[] = inviteCodes.map((inviteCode) => ({
    code: inviteCode.code,
    redeemed: inviteCode.redeemed,
  }));

  if (finalInviteCodes.length === 0 && user.emailVerified) {
    finalInviteCodes = generateInviteCodes(5);
    try {
      await insertInviteCodes({
        inviteCodes: finalInviteCodes,
        userId: user.id,
      });
    } catch (error) {
      throw logAndReturnGenericError(error);
    }
  }

  return NextResponse.json({
    success: true,
    authenticators: finalAuthenticators,
    inviteCodes: finalInviteCodes,
  });
};

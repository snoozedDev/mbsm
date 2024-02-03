"use server";

import { logAndReturnGenericError } from "@/server/serverUtils";
import { generateInviteCodes } from "@/utils/inviteCodeUtils";
import {
  getAuthenticatorsForUser,
  getUserInviteCodes,
  insertInviteCodes,
} from "@mbsm/db-layer";
import { Authenticator, InviteCode } from "@mbsm/types";
import { cookies } from "next/headers";
import { getAuthContext } from "./actionUtils";
import { ActionResponse } from "./authActions";

export const getUserSettings = async (): Promise<
  ActionResponse<{
    authenticators: Authenticator[];
    inviteCodes: InviteCode[];
  }>
> => {
  const authRes = await getAuthContext(cookies());
  if (!authRes.success) return authRes;
  const { user } = authRes;

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
      return logAndReturnGenericError(error, "internal");
    }
  }

  return {
    success: true,
    authenticators: finalAuthenticators,
    inviteCodes: finalInviteCodes,
  };
};

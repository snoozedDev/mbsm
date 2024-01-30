"use server";

import { logAndReturnGenericError } from "@/server/serverUtils";
import { generateInviteCodes } from "@/utils/inviteCodeUtils";
import {
  getAuthenticatorsForUser,
  getUserInviteCodes,
  insertInviteCodes,
} from "@mbsm/db-layer";
import { Authenticator, InviteCode } from "@mbsm/types";
import { actionWithAuthContext } from "./actionUtils";

export const getUserSettings = actionWithAuthContext({
  authRequired: true,
  action: async ({ user }) => {
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

    return {
      authenticators: finalAuthenticators,
      inviteCodes: finalInviteCodes,
    };
  },
});

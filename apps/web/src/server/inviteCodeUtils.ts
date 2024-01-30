import { getUnredeemedInviteCode } from "@mbsm/db-layer";
import { getEnvAsStr } from "@mbsm/utils";
import { logAndReturnGenericError } from "./serverUtils";

export const validateInviteCode = async (inviteCode: string) => {
  if (inviteCode !== getEnvAsStr("REUSABLE_INVITE_CODE")) {
    const code = await getUnredeemedInviteCode(inviteCode);

    if (!code) {
      return logAndReturnGenericError(
        "No valid invite code found",
        "badRequest"
      );
    }
  }
};

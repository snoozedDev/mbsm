"use server";

import { validateInviteCode } from "@/server/inviteCodeUtils";
import { loginLimiter, registerLimiter } from "@/server/rateLimit";
import {
  deleteEmailVerificationCode,
  generateEmailVerificationCodeAndSend,
  getEmailVerificationCode,
  logAndReturnGenericError,
} from "@/server/serverUtils";
import { createAndSetAuthTokens } from "@/utils/tokenUtils";
import {
  getWebAuthnLoginOptions,
  getWebAuthnRegistrationOptions,
  getWebAuthnResponseForAuthentication,
  getWebAuthnResponseForRegistration,
} from "@/utils/webAuthnUtils";
import {
  clearCurrentUserChallenge,
  getAuthenticatorAndUserByCredentialId,
  getAuthenticatorByCredentialId,
  getUserByEmail,
  insertAuthenticator,
  insertUser,
  updateAuthenticator,
  updateInviteCode,
  updateUser,
} from "@mbsm/db-layer";
import { Authenticator } from "@mbsm/types";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import { getAuthContext } from "./actionUtils";

export type SuccessResponse = { success: true };
export type ErrorResponse = { success: false; error: string };
export type ActionResponse<T = undefined> =
  | (SuccessResponse & (T extends undefined ? {} : T))
  | ErrorResponse;

export const isActionResponseWithData = <T>(
  res: ActionResponse<T>
): res is SuccessResponse & { data: T } => {
  return res.success && "data" in res;
};

export const logout = async () => {
  const cookieStore = cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUserInfo = async (): Promise<
  ActionResponse<{
    email: string;
    emailVerified: boolean;
  }>
> => {
  const authRes = await getAuthContext();
  if (!authRes.success) return authRes;
  const { user } = authRes;
  console.log({ authRes });
  return {
    success: true,
    email: user.email,
    emailVerified: user.emailVerified,
  };
};

export const login = async (): Promise<
  ActionResponse<{
    options: PublicKeyCredentialRequestOptionsJSON;
  }>
> => {
  const limitRes = await loginLimiter.middleware();
  console.log({ limitRes });
  if (limitRes) throw limitRes;
  const options = await getWebAuthnLoginOptions();
  return { success: true, options };
};

export const register = async ({
  email,
  inviteCode,
}: {
  email: string;
  inviteCode: string;
}): Promise<
  ActionResponse<{
    options: PublicKeyCredentialCreationOptionsJSON;
  }>
> => {
  const limitRes = await registerLimiter.middleware();
  if (limitRes) return limitRes;

  if (!inviteCode || !email) {
    return logAndReturnGenericError(
      "Missing invite code or email",
      "badRequest"
    );
  }

  const inviteCodeError = await validateInviteCode(inviteCode);
  if (inviteCodeError) return inviteCodeError;

  const nanoId = nanoid(12);

  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.protected) {
    return logAndReturnGenericError("User already exists", "badRequest");
  }

  const options = await getWebAuthnRegistrationOptions({
    userID: nanoId,
    userName: email,
  });

  if (existingUser) {
    await updateUser({
      id: existingUser.id,
      fields: {
        currentRegChallenge: options.challenge,
      },
    });
  } else {
    await insertUser({
      role: "user",
      email,
      nanoId,
      currentRegChallenge: options.challenge,
    });
  }

  return { success: true, options };
};

export const verifyLogin = async (attRes: any): Promise<ActionResponse> => {
  const limitRes = await loginLimiter.middleware();
  if (limitRes) return limitRes;
  const userAgent = headers().get("user-agent");
  if (!userAgent) {
    return logAndReturnGenericError("No user agent found", "unauthorized");
  }

  const result = await getAuthenticatorAndUserByCredentialId(attRes.id);

  if (!result) {
    return logAndReturnGenericError("No authenticator found", "unauthorized");
  }

  const { user, ...authenticator } = result;

  await clearCurrentUserChallenge(user.id);

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

  await updateAuthenticator({
    id: authenticator.id,
    fields: { counter: newCounter },
  });

  await createAndSetAuthTokens(user);

  return { success: true };
};

export const verifyRegister = async ({
  attRes,
  email,
  inviteCode,
}: {
  attRes: any;
  email: string;
  inviteCode: string;
}): Promise<ActionResponse> => {
  const limitRes = await registerLimiter.middleware();
  if (limitRes) return limitRes;
  const userAgent = headers().get("user-agent");
  if (!userAgent)
    return logAndReturnGenericError("No user agent found", "badRequest");

  const inviteCodeError = await validateInviteCode(inviteCode);
  if (inviteCodeError) return inviteCodeError;

  const user = await getUserByEmail(email);

  if (!user?.currentRegChallenge) {
    return logAndReturnGenericError("No user found", "unauthorized");
  }

  if (user.protected) {
    return logAndReturnGenericError("User already exists", "unauthorized");
  }

  let verification;
  try {
    verification = await getWebAuthnResponseForRegistration({
      attRes,
      expectedChallenge: user.currentRegChallenge,
    });
  } catch (e) {
    return logAndReturnGenericError(e, "unauthorized");
  }

  const { verified, registrationInfo } = verification;

  if (!verified) return logAndReturnGenericError("Verification failed");

  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialBackedUp,
    credentialDeviceType,
  } = registrationInfo!;

  await Promise.all([
    createAndSetAuthTokens(user),
    generateEmailVerificationCodeAndSend({
      email,
      userId: user.id,
    }),
    insertAuthenticator({
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
    updateUser({
      id: user.id,
      fields: {
        protected: true,
        currentRegChallenge: null,
      },
    }),
    updateInviteCode({
      code: inviteCode,
      fields: {
        redeemed: true,
      },
    }),
  ]);

  return { success: true };
};

export const getNewAuthenticatorOptions = async (): Promise<
  ActionResponse<{
    options: PublicKeyCredentialCreationOptionsJSON;
  }>
> => {
  const authRes = await getAuthContext();
  if (!authRes.success) return authRes;
  const { user } = authRes;

  const options = await getWebAuthnRegistrationOptions({
    userID: user.nanoId,
    userName: user.email,
  });

  await updateUser({
    id: user.id,
    fields: {
      currentRegChallenge: options.challenge,
    },
  });

  return { success: true, options };
};

export const verifyNewAuthenticator = async ({
  attRes,
}: {
  attRes: any;
}): Promise<
  ActionResponse<{
    authenticator: Authenticator;
  }>
> => {
  const authRes = await getAuthContext();
  if (!authRes.success) return authRes;
  const { user } = authRes;

  if (!user.currentRegChallenge)
    return logAndReturnGenericError("User has no challenge", "unauthorized");

  const verification = await getWebAuthnResponseForRegistration({
    attRes,
    expectedChallenge: user.currentRegChallenge,
  });

  const { verified, registrationInfo } = verification;

  if (!verified || !registrationInfo) {
    return logAndReturnGenericError("Verification failed", "unauthorized");
  }

  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialBackedUp,
    credentialDeviceType,
  } = registrationInfo;

  const now = new Date();
  const credentialId = Buffer.from(credentialID).toString("base64url");
  const name = nanoid(16);

  await Promise.all([
    insertAuthenticator({
      counter,
      credentialBackedUp,
      credentialDeviceType,
      credentialId,
      credentialPublicKey:
        Buffer.from(credentialPublicKey).toString("base64url"),
      name,
      transports: [].join(","),
      userId: user.id,
    }),
    updateUser({
      id: user.id,
      fields: {
        currentRegChallenge: null,
      },
    }),
  ]);

  const authenticator: Authenticator = {
    addedAt: now.toUTCString(),
    credentialId,
    name,
  };

  return {
    success: true,
    authenticator,
  };
};

export const verifyEmail = async ({
  code,
}: {
  code: string;
}): Promise<ActionResponse> => {
  const authRes = await getAuthContext();
  if (!authRes.success) return authRes;
  const { user } = authRes;

  if (user.emailVerified) return { success: true };

  let storedCode = await getEmailVerificationCode({ userId: user.id });

  if (
    !getEnvAsBool("IS_PROD") &&
    code === getEnvAsStr("DEV_VERIFICATION_CODE")
  ) {
    storedCode = code;
  }

  if (code !== storedCode?.toString()) {
    return logAndReturnGenericError(
      "Verification code is invalid",
      "badRequest"
    );
  }

  await Promise.all([
    updateUser({
      id: user.id,
      fields: {
        emailVerified: true,
      },
    }),
    deleteEmailVerificationCode({ userId: user.id }),
  ]);

  return { success: true };
};

export const renameAuthenticator = async ({
  credentialId,
  newName,
}: {
  newName: string;
  credentialId: string;
}): Promise<ActionResponse> => {
  const authRes = await getAuthContext();
  if (!authRes.success) return authRes;
  const { user } = authRes;

  const authenticator = await getAuthenticatorByCredentialId(credentialId);

  if (authenticator?.userId !== user.id || !authenticator) {
    throw logAndReturnGenericError("Unauthorized", "unauthorized");
  }

  await updateAuthenticator({
    fields: { name: newName },
    id: authenticator.id,
  });

  return { success: true };
};

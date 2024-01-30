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
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import { actionWithAuthContext } from "./actionUtils";

export const logout = async () => {
  const cookieStore = cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

export const getUserInfo = actionWithAuthContext({
  authRequired: true,
  action: async ({ user }) => {
    return {
      email: user.email,
      emailVerified: user.emailVerified,
    };
  },
});

export const login = async () => {
  const limitRes = await loginLimiter.middleware();
  if (limitRes) throw limitRes;
  const options = await getWebAuthnLoginOptions();
  return { options };
};

export const register = async ({
  email,
  inviteCode,
}: {
  email: string;
  inviteCode: string;
}) => {
  const limitRes = await registerLimiter.middleware();
  if (limitRes) throw limitRes;

  if (!inviteCode || !email) {
    throw logAndReturnGenericError(
      "Missing invite code or email",
      "badRequest"
    );
  }

  const inviteCodeError = await validateInviteCode(inviteCode);
  if (inviteCodeError) throw inviteCodeError;

  const nanoId = nanoid(12);

  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.protected) {
    throw logAndReturnGenericError("User already exists", "badRequest");
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

  return { options };
};

export const verifyLogin = async (attRes: any) => {
  const limitRes = await loginLimiter.middleware();
  if (limitRes) throw limitRes;
  const userAgent = headers().get("user-agent");
  if (!userAgent) {
    throw logAndReturnGenericError("No user agent found", "unauthorized");
  }

  const result = await getAuthenticatorAndUserByCredentialId(attRes.id);

  if (!result) {
    throw logAndReturnGenericError("No authenticator found", "unauthorized");
  }

  const { user, ...authenticator } = result;

  await clearCurrentUserChallenge(user.id);

  const verification = await getWebAuthnResponseForAuthentication({
    attRes,
    authenticator,
  });

  const { verified, authenticationInfo } = verification;

  if (!verified || !authenticationInfo) {
    throw logAndReturnGenericError(
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
};

export const verifyRegister = async ({
  attRes,
  email,
  inviteCode,
}: {
  attRes: any;
  email: string;
  inviteCode: string;
}) => {
  const limitRes = await registerLimiter.middleware();
  if (limitRes) return limitRes;
  const userAgent = headers().get("user-agent");
  if (!userAgent)
    throw logAndReturnGenericError("No user agent found", "badRequest");

  const inviteCodeError = await validateInviteCode(inviteCode);
  if (inviteCodeError) return inviteCodeError;

  const user = await getUserByEmail(email);

  if (!user?.currentRegChallenge) {
    throw logAndReturnGenericError("No user found", "unauthorized");
  }

  if (user.protected) {
    throw logAndReturnGenericError("User already exists", "unauthorized");
  }

  let verification;
  try {
    verification = await getWebAuthnResponseForRegistration({
      attRes,
      expectedChallenge: user.currentRegChallenge,
    });
  } catch (e) {
    throw logAndReturnGenericError(e, "unauthorized");
  }

  const { verified, registrationInfo } = verification;

  if (!verified) throw logAndReturnGenericError("Verification failed");

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
};

export const getNewAuthenticatorOptions = actionWithAuthContext({
  authRequired: true,
  action: async ({ user }) => {
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

    return { options };
  },
});

export const verifyNewAuthenticator = actionWithAuthContext<
  { attRes: any },
  { authenticator: Authenticator }
>({
  authRequired: true,
  action: async ({ user, params }) => {
    if (!user.currentRegChallenge)
      throw logAndReturnGenericError("User has no challenge", "unauthorized");

    const verification = await getWebAuthnResponseForRegistration({
      attRes: params.attRes,
      expectedChallenge: user.currentRegChallenge,
    });

    const { verified, registrationInfo } = verification;

    if (!verified || !registrationInfo) {
      throw logAndReturnGenericError("Verification failed", "unauthorized");
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
      authenticator,
    };
  },
});

export const verifyEmail = actionWithAuthContext<{ code: string }>({
  authRequired: true,
  action: async ({ user, params }) => {
    if (user.emailVerified) return;

    const { code } = params;

    let storedCode = await getEmailVerificationCode({ userId: user.id });

    if (
      !getEnvAsBool("IS_PROD") &&
      code === getEnvAsStr("DEV_VERIFICATION_CODE")
    ) {
      storedCode = code;
    }

    if (code !== storedCode?.toString()) {
      throw logAndReturnGenericError(
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
  },
});

export const renameAuthenticator = actionWithAuthContext<{
  newName: string;
  credentialId: string;
}>({
  authRequired: true,
  action: async ({ user, params }) => {
    const { newName, credentialId } = params;

    const authenticator = await getAuthenticatorByCredentialId(credentialId);

    if (authenticator?.userId !== user.id) {
      throw logAndReturnGenericError("Unauthorized", "unauthorized");
    }

    await updateAuthenticator({
      fields: { name: newName },
      id: authenticator.id,
    });
  },
});

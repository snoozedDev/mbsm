// src/env.ts
var getEnvAsStr = (key) => {
  const value = process.env[key];
  if (!value)
    throw new Error(`Missing environment variable ${key}`);
  return value;
};
var getEnvAsInt = (key) => {
  const value = getEnvAsStr(key);
  const parsed = parseInt(value);
  if (isNaN(parsed))
    throw new Error(`Environment variable ${key} is not a number`);
  return parsed;
};
var getEnvAsBool = (key) => {
  const value = getEnvAsStr(key);
  if (value === "true")
    return true;
  if (value === "false")
    return false;
  throw new Error(`Environment variable ${key} is not a boolean`);
};

// src/mappers/account.ts
var toUserFacingAccount = ({
  account,
  avatar
}) => ({
  id: account.id,
  handle: account.handle,
  avatarUrl: (avatar == null ? void 0 : avatar.url) ?? void 0,
  profileData: account.profileData ?? void 0,
  joinedAt: account.createdAt.toISOString()
});

// src/mappers/authenticator.ts
var toUserFacingAuthenticator = ({
  authenticator
}) => ({
  credentialId: authenticator.credentialId,
  name: authenticator.name,
  addedAt: authenticator.createdAt.toISOString()
});

// src/mappers/file.ts
var toUserFacingFile = ({
  file
}) => ({
  id: file.id,
  url: file.url ?? null,
  sizeKB: file.sizeKB,
  createdAt: file.createdAt.toISOString()
});

// src/mappers/inviteCode.ts
var toUserFacingInviteCode = ({
  inviteCode
}) => ({
  code: inviteCode.code,
  redeemed: inviteCode.redeemed
});

// src/mappers/user.ts
var toUserFacingUser = ({
  user
}) => ({
  email: user.email,
  emailVerified: user.emailVerified,
  joinedAt: user.createdAt.toISOString(),
  storageLimitMB: user.storageLimitMB,
  role: user.role
});

// src/string.ts
var snakeToCamel = (str) => str.toLowerCase().replace(
  /([-_][a-z])/g,
  (group) => group.toUpperCase().replace("-", "").replace("_", "")
);
var getErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown error";
};

// src/zod.ts
var getFormattedZodError = (error) => error.issues.map((i) => i.message).join(", ");
export {
  getEnvAsBool,
  getEnvAsInt,
  getEnvAsStr,
  getErrorMessage,
  getFormattedZodError,
  snakeToCamel,
  toUserFacingAccount,
  toUserFacingAuthenticator,
  toUserFacingFile,
  toUserFacingInviteCode,
  toUserFacingUser
};

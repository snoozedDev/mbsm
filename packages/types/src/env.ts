const envVariables = [
  "IS_PROD",
  "POSTGRES_URL",
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "POSTGRES_DATABASE",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "KV_URL",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "KV_REST_API_READ_ONLY_TOKEN",
  "BLOB_READ_WRITE_TOKEN",
  "EDGE_CONFIG",
  "ORIGIN",
  "RP_NAME",
  "RP_ID",
  "SECRET_ATOKEN",
  "SECRET_RTOKEN",
  "RESEND_API_KEY",
  "DEV_VERIFICATION_CODE",
  "REUSABLE_INVITE_CODE",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CONVEX_DEPLOYMENT",
  "NEXT_PUBLIC_CONVEX_URL",
] as const;

type EnvVariablesType = {
  [K in (typeof envVariables)[number]]: string;
};

export type EnvVariablesKeys = keyof EnvVariablesType;

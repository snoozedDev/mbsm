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
  "EDGE_CONFIG",
  "ORIGIN",
  "RP_NAME",
  "RP_ID",
  "SERVER_PROCEDURE_SECRET",
  "SECRET_ATOKEN",
  "SECRET_RTOKEN",
  "RESEND_API_KEY",
  "DEV_VERIFICATION_CODE",
  "REUSABLE_INVITE_CODE",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_S3_BUCKET",
] as const;

type EnvVariablesType = {
  [K in (typeof envVariables)[number]]: string;
};

export type EnvVariablesKeys = keyof EnvVariablesType;

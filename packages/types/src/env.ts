const envVariables = [
  "IS_PROD",
  "DB_HOST",
  "DB_PORT",
  "DB_DATABASE",
  "DB_USER",
  "DB_PASSWORD",
  "DATABASE_URL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "ORIGIN",
  "RP_NAME",
  "RP_ID",
  "SECRET_ATOKEN",
  "SECRET_RTOKEN",
  "RESEND_API_KEY",
  "DEV_VERIFICATION_CODE",
  "REUSABLE_INVITE_CODE",
  "CRON_CODE",
] as const;

type EnvVariablesType = {
  [K in (typeof envVariables)[number]]: string;
};

export type EnvVariablesKeys = keyof EnvVariablesType;

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
] as const;

type EnvVariablesType = {
  [K in (typeof envVariables)[number]]: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariablesType {}
  }
}

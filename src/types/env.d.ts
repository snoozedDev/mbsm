const envVariables = [
  "NODE_ENV",
  "DB_HOST",
  "DB_PORT",
  "DB_DATABASE",
  "DB_USER",
  "DB_PASSWORD",
] as const;

type EnvVariablesType = {
  [K in (typeof envVariables)[number]]: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariablesType {}
  }
}

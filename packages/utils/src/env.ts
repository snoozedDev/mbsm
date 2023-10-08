import type { EnvVariablesKeys } from "@mbsm/types";

export const getEnvAsStr = (key: EnvVariablesKeys): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable ${key}`);
  return value;
};

export const getEnvAsInt = (key: EnvVariablesKeys): number => {
  const value = getEnvAsStr(key);
  const parsed = parseInt(value);
  if (isNaN(parsed))
    throw new Error(`Environment variable ${key} is not a number`);
  return parsed;
};

export const getEnvAsBool = (key: EnvVariablesKeys): boolean => {
  const value = getEnvAsStr(key);
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Environment variable ${key} is not a boolean`);
};

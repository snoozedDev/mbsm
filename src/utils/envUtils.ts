export const getEnvAsStr = (key: keyof EnvVariablesType): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable ${key}`);
  return value;
};

export const getEnvAsInt = (key: keyof EnvVariablesType): number => {
  const value = getEnvAsStr(key);
  const parsed = parseInt(value);
  if (isNaN(parsed))
    throw new Error(`Environment variable ${key} is not a number`);
  return parsed;
};

export const getEnvAsBool = (key: keyof EnvVariablesType): boolean => {
  const value = getEnvAsStr(key);
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Environment variable ${key} is not a boolean`);
};

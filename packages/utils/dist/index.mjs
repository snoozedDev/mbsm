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
  snakeToCamel
};

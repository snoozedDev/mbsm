"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getEnvAsBool: () => getEnvAsBool,
  getEnvAsInt: () => getEnvAsInt,
  getEnvAsStr: () => getEnvAsStr,
  getErrorMessage: () => getErrorMessage,
  getFormattedZodError: () => getFormattedZodError,
  snakeToCamel: () => snakeToCamel
});
module.exports = __toCommonJS(src_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEnvAsBool,
  getEnvAsInt,
  getEnvAsStr,
  getErrorMessage,
  getFormattedZodError,
  snakeToCamel
});

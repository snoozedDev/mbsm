import "dotenv/config";
import { getEnvAsInt, getEnvAsStr } from "@mbsm/utils";
import type { Config } from "drizzle-kit";

export default {
  schema: "./packages/db-layer/src/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    host: getEnvAsStr("DB_HOST"),
    password: getEnvAsStr("DB_PASSWORD"),
    user: getEnvAsStr("DB_USER"),
    database: getEnvAsStr("DB_DATABASE"),
    port: getEnvAsInt("DB_PORT"),
  },
  verbose: true,
  strict: true,
} satisfies Config;

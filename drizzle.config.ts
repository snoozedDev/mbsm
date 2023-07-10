import "dotenv/config";
import type { Config } from "drizzle-kit";
import { getEnvAsInt, getEnvAsStr } from "./src/utils/envUtils";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  driver: "mysql2",
  introspect: {
    casing: "camel",
  },
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

import { getEnvAsInt, getEnvAsStr } from "@/utils/envUtils";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: getEnvAsStr("DB_HOST"),
    password: getEnvAsStr("DB_PASSWORD"),
    user: getEnvAsStr("DB_USER"),
    database: getEnvAsStr("DB_DATABASE"),
    port: getEnvAsInt("DB_PORT"),
  },
} satisfies Config;

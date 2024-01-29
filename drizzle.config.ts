import { getEnvAsStr } from "@mbsm/utils";
import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  out: "packages/db-layer/migrations",
  schema: "packages/db-layer/src/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: getEnvAsStr("POSTGRES_URL"),
  },
  verbose: true,
  strict: true,
} satisfies Config;

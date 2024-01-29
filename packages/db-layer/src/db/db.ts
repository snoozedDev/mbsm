import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { VercelPool, sql as vercel } from "@vercel/postgres";
import { drizzle as pgDrizzle } from "drizzle-orm/postgres-js";
import { drizzle as vercelDrizzle } from "drizzle-orm/vercel-postgres";
import postgres from "postgres";
import { schema } from "./schemaModels";

const IS_PROD = getEnvAsBool("IS_PROD");

const connection = IS_PROD ? vercel : postgres(getEnvAsStr("POSTGRES_URL"));

const isVercelConnection = (connection: any): connection is VercelPool =>
  !("END" in connection);

export const db = isVercelConnection(connection)
  ? vercelDrizzle(connection, { schema })
  : pgDrizzle(connection, { schema });

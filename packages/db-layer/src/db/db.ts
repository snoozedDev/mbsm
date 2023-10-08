import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { connect as psConnect } from "@planetscale/database";
import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import { drizzle as psDrizzle } from "drizzle-orm/planetscale-serverless";
import mysql from "mysql2/promise";
import { schema } from "./schemaModels";

const connection = getEnvAsBool("IS_PROD")
  ? psConnect({
      host: getEnvAsStr("DB_HOST"),
      password: getEnvAsStr("DB_PASSWORD"),
      username: getEnvAsStr("DB_USER"),
    })
  : mysql.createPool({
      host: getEnvAsStr("DB_HOST"),
      password: getEnvAsStr("DB_PASSWORD"),
      user: getEnvAsStr("DB_USER"),
      database: getEnvAsStr("DB_DATABASE"),
    });

const isMySQLConnection = (connection: any): connection is mysql.Pool =>
  "releaseConnection" in connection;

export const db = isMySQLConnection(connection)
  ? mysqlDrizzle(connection, { schema, mode: "default" })
  : psDrizzle(connection, { schema });

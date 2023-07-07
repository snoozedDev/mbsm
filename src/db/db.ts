import { getEnvAsStr } from "@/utils/envUtils";
import { connect as psConnect } from "@planetscale/database";
import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import { drizzle as psDrizzle } from "drizzle-orm/planetscale-serverless";
import mysql from "mysql2/promise";

const usePS = getEnvAsStr("NODE_ENV") !== "development";

const connection = usePS
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
  ? mysqlDrizzle(connection)
  : psDrizzle(connection);

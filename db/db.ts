import { Pool } from "pg";
import { environment } from "../utils/env";

const { DB_USER, DB_HOST, DB_PASS, DB_NAME, DB_PORT } = environment;

export const templatePool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASS,
  port: DB_PORT,
  database: "template1",
});

export const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASS,
  port: DB_PORT,
  database: DB_NAME,
});

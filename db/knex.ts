import knex from "knex";
import { environment } from "../utils/env";

const { DB_USER, DB_HOST, DB_PASS, DB_NAME } = environment;

export const kx = knex({
  client: "pg",
  version: "11",
  pool: { min: 0, max: 7 },
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  },
});

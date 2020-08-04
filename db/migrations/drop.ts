import fs from "fs";
import { pool } from "../db";

var sql = fs.readFileSync(__dirname + "/sql/drop.pgsql").toString();

pool
  .query(sql)
  .then(() => {
    console.log("Sucessfully dropped database.");
    process.exit();
  })
  .catch((err) => {
    console.log("There was an issue dropping the database.\n", err);
    process.exit();
  });

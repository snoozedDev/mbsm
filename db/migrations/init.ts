import fs from "fs";
import { pool } from "../db";

var sql = fs.readFileSync(__dirname + "/sql/init.pgsql").toString();

pool
  .query(sql)
  .then(() => {
    console.log("Sucessfully initialized the database.");
    process.exit();
  })
  .catch((err) => {
    console.log("There was an issue initializing the database.\n", err);
    process.exit();
  });

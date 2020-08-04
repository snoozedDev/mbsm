import fs from "fs";
import { templatePool } from "../db";

var sql = fs.readFileSync(__dirname + "/sql/create.pgsql").toString();

templatePool
  .query(sql)
  .then(() => {
    console.log("Sucessfully created the database.");
    process.exit();
  })
  .catch((err) => {
    console.log("There was an issue creating the database.\n", err);
    process.exit();
  });

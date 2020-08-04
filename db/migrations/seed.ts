import fs from "fs";
import { pool } from "../db";

var files = fs.readdirSync(__dirname + "/sql/seed");

const promiseLoop = async (index) => {
  const tableName = files[index].split(".")[1];
  const contents = fs
    .readFileSync(__dirname + "/sql/seed/" + files[index])
    .toString();

  await pool
    .query(contents)
    .then(() => {
      console.log(`Successfully seeded ${tableName}.`);
      if (files[index + 1]) promiseLoop(index + 1);
      else process.exit();
    })
    .catch((e) => {
      console.log(`Error while seeding ${tableName}.\n`, e);
      process.exit();
    });
};

promiseLoop(0);

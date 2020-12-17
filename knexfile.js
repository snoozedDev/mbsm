const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

module.exports = {
  client: "postgresql",
  connection: {
    host: DB_HOST,
    database: DB_NAME,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: "db/migrations",
  },
  seeds: {
    directory: "db/seeds",
  },
};

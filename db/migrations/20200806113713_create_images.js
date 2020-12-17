exports.up = function (knex) {
  return knex.schema.createTable("images", (images) => {
    images.increments("id").primary();
    images.string("url", 96).notNullable();
    images.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("images");
};

/*
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    url VARCHAR(96) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/

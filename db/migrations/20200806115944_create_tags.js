exports.up = function (knex) {
  return knex.schema.createTable("tags", (tags) => {
    tags.increments().primary();
    tags.text("value").unique().notNullable();
    tags.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tags");
};

/*
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    value varchar(32) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/

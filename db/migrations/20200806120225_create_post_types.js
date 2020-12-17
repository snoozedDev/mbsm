exports.up = function (knex) {
  return knex.schema.createTable("post_types", (postTypes) => {
    postTypes.increments().primary();
    postTypes.text("value").unique().notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("post_types");
};

/*
CREATE TABLE post_types (
    id SERIAL PRIMARY KEY,
    value varchar(16) NOT NULL
);
*/

exports.up = function (knex) {
  return knex.schema.createTable("users", (users) => {
    users.increments().primary();
    users.text("username").notNullable();
    users.text("password").notNullable();
    users.integer("avatar_id").unsigned().notNullable().defaultTo(1);
    users.timestamps();

    users.foreign("avatar_id").references("images.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};

/*
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    username varchar(32) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    avatar_id SERIAL NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (avatar_id) REFERENCES images (id)
);
*/

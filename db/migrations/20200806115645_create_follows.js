exports.up = function (knex) {
  return knex.schema.createTable("follows", (follows) => {
    follows.integer("user_id").unsigned().notNullable();
    follows.integer("follower_id").unsigned().notNullable();

    follows.foreign("user_id").references("users.id");
    follows.foreign("follower_id").references("users.id");
    follows.primary(["user_id", "follower_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("follows");
};

/*
CREATE TABLE follows (
    user_id uuid NOT NULL,
    follower_id uuid NOT NULL,

    CONSTRAINT follows_pkey PRIMARY KEY (user_id, follower_id)
);
*/

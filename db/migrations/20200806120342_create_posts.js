exports.up = function (knex) {
  return knex.schema.createTable("posts", (posts) => {
    posts.string("id", 16).primary();
    posts.integer("author_id").unsigned().notNullable();
    posts.integer("type_id").unsigned().notNullable();
    posts.text("title");
    posts.text("body");
    posts.timestamp("created_at").defaultTo(knex.fn.now());

    posts.foreign("author_id").references("users.id");
    posts.foreign("type_id").references("post_types.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts");
};

/*
CREATE TABLE posts (
    id varchar(16) NOT NULL PRIMARY KEY,
    author_id uuid NOT NULL,
    type_id SERIAL NOT NULL,
    title varchar,
    body varchar,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (author_id) REFERENCES users (id),
    FOREIGN KEY (type_id) REFERENCES post_types (id)
);
*/

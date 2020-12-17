exports.up = function (knex) {
  return knex.schema.createTable("posts_tags", (postsTags) => {
    postsTags.integer("tag_id").unsigned().notNullable();
    postsTags.string("post_id", 16).notNullable();

    postsTags.foreign("tag_id").references("tags.id");
    postsTags.foreign("post_id").references("posts.id");
    postsTags.primary(["tag_id", "post_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts_tags");
};

/*
CREATE TABLE posts_tags (
    tag_id SERIAL REFERENCES tags (id) ON UPDATE CASCADE ON DELETE CASCADE,
    post_id varchar( 20) REFERENCES posts (id) ON UPDATE CASCADE,

    CONSTRAINT posts_tags_pkey PRIMARY KEY (tag_id, post_id)
)
*/

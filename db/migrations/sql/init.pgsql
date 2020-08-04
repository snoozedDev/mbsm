CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    url VARCHAR(96) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    username varchar(32) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    avatar_id SERIAL NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (avatar_id) REFERENCES images (id)
);

CREATE TABLE follows (
    user_id uuid NOT NULL,
    follower_id uuid NOT NULL,

    CONSTRAINT follows_pkey PRIMARY KEY (user_id, follower_id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    value varchar(32) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_types (
    id SERIAL PRIMARY KEY,
    value varchar(16) NOT NULL
);

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

CREATE TABLE posts_tags (
    tag_id SERIAL REFERENCES tags (id) ON UPDATE CASCADE ON DELETE CASCADE,
    post_id varchar( 20) REFERENCES posts (id) ON UPDATE CASCADE,

    CONSTRAINT posts_tags_pkey PRIMARY KEY (tag_id, post_id)
)

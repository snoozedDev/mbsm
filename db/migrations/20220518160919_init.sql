-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create type user_status as enum ('public', 'private');

create type post_visibility as enum ('all', 'followrs', 'mutuals');

create type post_type as enum ('blog', 'gallery', 'reply');

CREATE TABLE images (
  id uuid default uuid_generate_v4() primary key,
  aspect_ratio real not null,
  height smallserial not null,
  width smallserial not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp,
  deleted_at timestamp
);

CREATE TABLE accounts (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password text,
  oauth jsonb,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp,
  deleted_at timestamp
);

CREATE TABLE users (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references accounts(id) not null,
  username text unique not null,
  avatar_id uuid references images(id),
  status user_status not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp,
  deleted_at timestamp
);

CREATE TABLE user_profiles (
  user_id uuid references users(id) primary key,
  header_id uuid references images(id),
  biography text,
  socials jsonb
);

CREATE TABLE tags (text text primary key, description text);

CREATE TABLE posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references users(id) not null,
  visibility post_visibility not null,
  type post_type not null,
  data jsonb not null
);

CREATE TABLE post_tags (
  post_id uuid references posts(id),
  tag_text text references tags(text),
  primary key (post_id, tag_text)
);

CREATE TABLE feed_posts (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references posts(id) not null,
  is_repost boolean not null,
  author_id uuid references users(id) not null
);

CREATE TABLE feed_post_likes (
  feed_post_id uuid references feed_posts(id),
  liker_id uuid references users(id),
  primary key (feed_post_id, liker_id)
);

CREATE TABLE user_follows (
  follower_id uuid references users(id),
  followee_id uuid references users(id),
  primary key (follower_id, followee_id)
);

-- migrate:down
drop table if exists user_follows;

drop table if exists feed_post_likes;

drop table if exists feed_posts;

drop table if exists post_tags;

drop table if exists posts;

drop table if exists tags;

drop table if exists user_profiles;

drop table if exists users;

drop table if exists accounts;

drop table if exists images;

drop type if exists user_status cascade;

drop type if exists post_visibility cascade;

drop type if exists post_type cascade;
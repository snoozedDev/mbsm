import moment from "moment";
import { TextPost } from "../../utils/types";
import { generateId } from "../../utils/utils";
import { kx } from "../knex";

interface IPost {
  id: string;
  author_id: string;
  type_id: number;
  title: string;
  body: string;
  created_at: string;
}

interface PostPayload {
  author_id: string;
  type_id: number;
  title: string;
  body: string;
}

const getById = (id: string): Promise<IPost> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [post] = await kx("posts").where({ id });
      resolve(post);
    } catch (e) {
      reject(e);
    }
  });
};

const create = ({
  title,
  body,
  author_id,
  type_id,
}: PostPayload): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = generateId();
      const [post] = await kx("posts")
        .returning("*")
        .insert({ id, title, body, author_id, type_id });
      resolve(post);
    } catch (e) {
      reject(e);
    }
  });
};

const getFull = (id: string): Promise<TextPost> => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await getById(id);
      const [author] = await kx("users")
        .select("users.username", "images.url as avatar")
        .where({ "users.id": post.author_id })
        .join("images", { "users.avatar_id": "images.id" });
      const tags = await kx("posts_tags")
        .select("tags.value")
        .where({ post_id: post.id })
        .leftJoin("tags", "posts_tags.tag_id", "tags.id");
      const [type] = await kx("post_types")
        .select("value")
        .where({ id: post.type_id });

      resolve({
        author,
        created_at: post.created_at,
        tags: tags.map((tag) => tag.value),
        type: type.value,
        title: post.title,
        body: post.body,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getFullFeedForUser = (follower_id: string): Promise<TextPost[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const following_ids = await kx("follows")
        .select("users.id")
        .where({ follower_id })
        .innerJoin("users", "follows.user_id", "users.id")
        .union([kx.select("id").from("users").where({ id: follower_id })]);
      const feed = await kx("posts")
        .select("id")
        .whereIn(
          "author_id",
          following_ids.map((f) => f.id)
        );
      const fullFeed = await Promise.all(feed.map((p) => getFull(p.id)));
      const sortedFeed = fullFeed.sort((a, b) =>
        moment(a.created_at).isBefore(b.created_at) ? 1 : -1
      );

      resolve(sortedFeed);
    } catch (e) {
      reject(e);
    }
  });
};

export const Post = {
  getById,
  create,
  getFull,
  getFullFeedForUser,
};

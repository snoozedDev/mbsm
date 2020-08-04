import { genSaltSync, hashSync } from "bcrypt";
import { kx } from "../knex";
import { Image } from "./image";

interface IUser {
  id: string;
  username: string;
  password: string;
}

interface CompleteIUser {
  id: string;
  username: string;
  avatar: string;
}

const getById = (id: string): Promise<IUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user] = await kx("users").where({ id });
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getByIdComplete = (id: string): Promise<CompleteIUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user] = await kx("users")
        .select(["users.id", "users.username", "images.url as avatar"])
        .where("users.id", id)
        .join("images", { "users.avatar_id": "images.id" });
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getByUsername = (username: string): Promise<IUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user] = await kx("users").select("*").where("username", username);
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getByUsernameComplete = (username: string): Promise<CompleteIUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user] = await kx("users").select("*").where("username", username);
      if (!user) reject("User does not exist.");
      const userComplete = await getByIdComplete(user.id);
      resolve(userComplete);
    } catch (e) {
      reject(e);
    }
  });
};

const create = (username: string, password: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user] = await kx("users")
        .returning("*")
        .insert({
          username,
          password: hashSync(password, genSaltSync()),
        });
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const follow = (user_id: string, follower_id: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await kx("follows").insert({
        user_id,
        follower_id,
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const unfollow = (user_id: string, follower_id: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await kx("follows").del().where({ user_id, follower_id });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const changeAvatar = (id: string, new_avatar_id: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { avatar_id } = await kx("users")
        .select("avatar_id")
        .where({ id })
        .first();
      (async () => {
        if (avatar_id !== 1) {
          const { url } = await kx("images")
            .select("url")
            .where({ id: avatar_id })
            .first();
          Image.deleteByUrl(url);
        }
      })();
      await kx("users")
        .returning("*")
        .where({ id })
        .update({ avatar_id: new_avatar_id });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const isFollowing = (follower_id: string, user_id: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [following] = await kx("follows").where({ user_id, follower_id });
      resolve(!!following);
    } catch (e) {
      reject(e);
    }
  });
};

export const User = {
  getById,
  getByIdComplete,
  getByUsername,
  getByUsernameComplete,
  create,
  follow,
  unfollow,
  isFollowing,
  changeAvatar,
};

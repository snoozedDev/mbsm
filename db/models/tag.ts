import { kx } from "../knex";

interface ITag {
  id: string;
  value: string;
}

const getByValue = (value: string): Promise<ITag> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [tag] = await kx("tags").where({ value });
      resolve(tag);
    } catch (e) {
      reject(e);
    }
  });
};

const createOrGet = (value: string): Promise<ITag> => {
  return new Promise(async (resolve, reject) => {
    try {
      let tag = await getByValue(value);
      if (tag) resolve(tag);
      [tag] = await kx("tags").returning("*").insert({ value });
      resolve(tag);
    } catch (e) {
      reject(e);
    }
  });
};

const createOrGetFromArray = (values: string[]): Promise<ITag[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const tags = await Promise.all<ITag>(
        values.map((value) => createOrGet(value))
      );
      resolve(tags);
    } catch (e) {
      reject(e);
    }
  });
};

const relateToPost = (value: string, post_id: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const tag = await createOrGet(value);
      await kx("posts_tags").insert({ post_id, tag_id: tag.id });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const relateToPostFromArray = (
  values: string[],
  post_id: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all(values.map((value) => relateToPost(value, post_id)));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const Tag = {
  getByValue,
  createOrGet,
  createOrGetFromArray,
  relateToPost,
  relateToPostFromArray,
};

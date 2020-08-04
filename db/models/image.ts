import { environment } from "../../utils/env";
import { kx } from "../knex";
import { cdn } from "../s3";

const { CDN_BUCKET, CDN_URL } = environment;

interface IImage {
  id: string;
  url: string;
}

const getById = (id: string): Promise<IImage> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [image] = await kx("images").where({ id });
      resolve(image);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteByUrl = (url: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedKey = url.substr(url.indexOf(".art") + 5);
      console.log("parsed:", parsedKey);
      await cdn
        .deleteObject({
          Bucket: CDN_BUCKET,
          Key: parsedKey,
        })
        .promise();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const upload = (filename: string, file: Buffer): Promise<IImage> => {
  return new Promise(async (resolve, reject) => {
    let url;
    try {
      const result = await cdn
        .upload({
          Bucket: CDN_BUCKET,
          Body: file,
          Key: filename,
          ContentType: "image/png",
        })
        .promise();
      url = `${CDN_URL}/${result.Key}`;
    } catch (e) {
      reject(e);
    }
    try {
      let [image] = await kx("images").returning("*").insert({ url });
      resolve(image);
    } catch (e) {
      reject(e);
    }
  });
};

export const Image = {
  getById,
  upload,
  deleteByUrl,
};

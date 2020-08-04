import AWS from "aws-sdk";
import { environment } from "../utils/env";

const { CDN_REGION, CDN_KEY, CDN_SECRET } = environment;

AWS.config.update({
  region: CDN_REGION,
});

export const cdn = new AWS.S3({
  accessKeyId: CDN_KEY,
  secretAccessKey: CDN_SECRET,
});

import { NextApiHandler } from "next";
import { PostResponse } from "../../../utils/types";
import { renewTokenCookie } from "../../../utils/auth";
import { Post } from "../../../db/models/post";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") return res.send(404);

  let response: PostResponse = {
    success: false,
    error: "Unknown.",
  };

  create: try {
    const { id } = req.query;
    const post = await Post.getFull(id as string);

    console.log(post);

    renewTokenCookie(req, res);
    response.success = true;
    response.error = undefined;
    response.post = post;
  } catch (e) {
    console.log(e);
  }

  res.send(response);
};

export default handler;

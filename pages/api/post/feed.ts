import { NextApiHandler } from "next";
import { Post } from "../../../db/models/post";
import { User } from "../../../db/models/user";
import {
  getSession,
  removeTokenCookie,
  renewTokenCookie,
} from "../../../utils/auth";
import { FeedResponse } from "../../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") return res.send(404);

  let response: FeedResponse = {
    success: false,
    error: "Unknown.",
  };
  user: try {
    const session = await getSession(req);
    const user = await User.getByUsername(session.username);
    if (!user) {
      response.error = "Unauthenticated.";
      removeTokenCookie(req);
      break user;
    }

    const posts = await Post.getFullFeedForUser(user.id);

    renewTokenCookie(req, res);
    response.success = true;
    response.error = undefined;
    response.feed = posts;
  } catch (e) {
    console.log(e);
  }

  res.send(response);
};

export default handler;

import { NextApiHandler } from "next";
import { User } from "../../../db/models/user";
import { getSession, renewTokenCookie } from "../../../utils/auth";
import { APIResponse } from "../../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.send(404);

  let response: APIResponse = {
    success: false,
    error: "Unknown.",
  };

  try {
    const { username } = req.body;
    const session = await getSession(req);
    const follower = await User.getByUsername(session.username);
    const user = await User.getByUsername(username);
    await User.unfollow(user.id, follower.id);
    response.success = true;
    response.error = undefined;
    renewTokenCookie(req, res);
  } catch (e) {
    console.log(e);
  }

  res.send(response);
};

export default handler;

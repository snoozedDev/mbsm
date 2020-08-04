import nc, { NextConnect } from "next-connect";
import { User } from "../../../db/models/user";
import { authMiddleware, renewTokenCookie } from "../../../utils/auth";
import { ProfileResponse } from "../../../utils/types";

const handler: NextConnect = nc()
  .use(authMiddleware)
  .get(async (req: any, res) => {
    let response: ProfileResponse = {
      success: false,
      error: "Unknown.",
    };

    try {
      const { username } = req.query;
      const user = await User.getByUsernameComplete(username as string);
      let following = false;
      if (req.user) {
        following = await User.isFollowing(req.user.id, user.id);
      }
      renewTokenCookie(req, res);
      response.success = true;
      response.error = undefined;
      response.user = {
        username: user.username,
        avatar: user.avatar,
        following,
      };
    } catch (e) {
      console.log(e);
    }

    res.send(response);
  });

export default handler;

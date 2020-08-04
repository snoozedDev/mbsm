import nc, { NextConnect } from "next-connect";
import { authMiddleware } from "../../../utils/auth";
import { UserResponse } from "../../../utils/types";

const handler: NextConnect = nc()
  .use(authMiddleware)
  .get(async (req: any, res) => {
    let response: UserResponse = {
      success: false,
      error: "Unknown.",
    };

    response.success = true;
    response.error = undefined;
    response.user = {
      username: req.user.username,
      avatar: req.user.avatar,
    };
    res.send(response);
  });

export default handler;

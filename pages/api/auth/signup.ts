import { NextApiHandler } from "next";
import { User } from "../../../db/models/user";
import { encryptSession, setTokenCookie } from "../../../utils/auth";
import { mbsmSession, SignupResponse } from "../../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.send(404);

  let response: SignupResponse = {
    success: false,
    error: "Unknown.",
  };

  create: try {
    const { username, password } = req.body;
    const user = await User.create(username, password);
    if (!user) {
      break create;
    }

    const session: mbsmSession = {
      username: user.username,
    };
    const token = await encryptSession(session);
    setTokenCookie(res, token);
    response.success = true;
    response.error = undefined;
  } catch (e) {
    console.log(e);
  }

  res.send(response);
};

export default handler;

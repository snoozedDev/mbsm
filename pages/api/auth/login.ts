import { compare } from "bcrypt";
import { NextApiHandler } from "next";
import { User } from "../../../db/models/user";
import { encryptSession, setTokenCookie } from "../../../utils/auth";
import { LoginResponse, mbsmSession } from "../../../utils/types";
import { wait } from "../../../utils/utils";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.send(404);

  let response: LoginResponse = {
    success: false,
    error: "Unknown.",
  };

  select: try {
    const { username, password } = req.body;
    const user = await User.getByUsername(username);
    if (!user) {
      await wait(500);
      response.error = "User doesn't exist.";
      break select;
    }

    const passwordCorrect = await compare(password, await user.password);
    if (!passwordCorrect) {
      response.error = "Bad password.";
      break select;
    }

    const session: mbsmSession = {
      username: username,
    };
    const token = await encryptSession(session);
    setTokenCookie(res, token);
    response.success = true;
  } catch (e) {
    console.log(e);
  }

  res.send(response);
};

export default handler;

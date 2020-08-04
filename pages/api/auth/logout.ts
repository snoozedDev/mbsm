import { NextApiHandler } from "next";
import { getSession, removeTokenCookie } from "../../../utils/auth";
import { APIResponse } from "../../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") return res.send(404);

  let response: APIResponse = {
    success: false,
    error: "Unknown.",
  };

  logout: try {
    const session = getSession(req);

    if (!session) {
      response.error = "Not logged in.";
      break logout;
    }

    removeTokenCookie(res);
    response.success = true;
  } catch (e) {
    console.log(e);
  }

  res.send(response);
};

export default handler;

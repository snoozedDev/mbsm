// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "../../db/prisma_client";
import bcrypt from "bcrypt";
import { APIResponse } from "../../types/api_types";
import { mbsmSession } from "../../types/auth_types";
import { encryptSession, setTokenCookie } from "../../utils/auth_utils";

const handler: NextApiHandler<APIResponse<undefined>> = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(404).send({ error: "Not found", success: false });
  }
  const { email, password, username } = req.body;

  const existingAccount = await dbClient.accounts.findUnique({
    where: {
      email,
    },
  });
  const existingUser = await dbClient.users.findUnique({
    where: {
      username,
    },
  });

  if (existingAccount || existingUser) {
    res
      .status(409)
      .json({ success: false, error: "User or Email already registered." });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);

    const account = await dbClient.accounts.create({
      data: {
        email: email,
        password: hash,
      },
    });
    const user = await dbClient.users.create({
      data: {
        status: "public",
        username,
        owner_id: account.id,
      },
    });

    const session: mbsmSession = {
      accountId: account.id,
      currentUserId: user.id,
    };
    const token = await encryptSession(session);
    setTokenCookie(res, token);
    return res.status(200).send({ success: true, data: undefined });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .send({ success: false, error: "Unknown error ocurred." });
  }
};

export default handler;

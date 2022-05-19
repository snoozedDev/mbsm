// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "../../db/prisma_client";

const handler: NextApiHandler = async (_req, res) => {
  // const result = await dbClient.users.create({
  //   data: { status: "public", username: "asd" },
  // });

  res.status(200).json({ name: "John Doe" });
};

export default handler;

import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  res.send("hey2");
};

export default handler;

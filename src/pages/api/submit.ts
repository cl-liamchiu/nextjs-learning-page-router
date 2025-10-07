import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.body;
  console.log("req.body", req.body);
  console.log("Received Name:", name);
  const id = Math.random().toString(36).substring(2, 15);
  res.status(200).json({ id, name });
}

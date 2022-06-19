// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Cache from "@lib/server/utils/cache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await Cache.clear()
  res.status(200).send('ok');
}

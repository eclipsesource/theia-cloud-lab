import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../db';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const statiscticResponse = await prisma.statistic.create({
      data: req.body,
    });
    return res.status(201).send(statiscticResponse);
  } catch (err) {
    return res.status(400).send(err);
  }
}

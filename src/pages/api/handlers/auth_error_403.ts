import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(403).send({ message: "Authorization Failed" });
}

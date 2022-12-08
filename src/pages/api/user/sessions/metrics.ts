// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Theia Service Client
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  // const userId = req.headers['x-user-mail'];
  // Handle POST request
  if (req.method === 'GET') {
    const sessionMetrics = await theiaService.getSessionMetricsList('asdfghjkl', req.query.sessionName);
    return res.status(200).send(sessionMetrics);
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import appConfig from '../../../../../configs/app_config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Theia Service Client
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  // Handle POST request
  if (req.method === 'GET') {
    try {
      const sessionMetrics = await theiaService.getSessionMetricsList(appConfig.appId, req.query.sessionName);
      return res.status(200).send(sessionMetrics);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

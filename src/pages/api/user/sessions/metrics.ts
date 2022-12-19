// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import appConfig from '../../../../../configs/app_config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  if (req.method === 'POST') {
    try {
      const sessionMetrics = await theiaService.getSessionMetricsList(appConfig.appId, req.body.sessionName);
      return res.status(200).send(sessionMetrics);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }
}

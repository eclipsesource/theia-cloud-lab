// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import appConfig from '../../../../../configs/app_config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Theia Service Client
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  const userId = req.headers['x-user-mail'];
  // Handle POST request
  if (req.method === 'POST') {
    try {
      let newSession;
      if (!req.body['workspaceName']) {
        newSession = await theiaService.createSessionWithNewWorkspace(
          appConfig.appId,
          userId,
          req.body['appDefinition']
        );
      } else {
        newSession = await theiaService.createSessionWithExistingWorkspace(
          appConfig.appId,
          userId,
          req.body.workspaceName,
          req.body.appDefinition
        );
      }
      return res.status(200).send(newSession);
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
    // Handle delete request
  } else if (req.method === 'DELETE') {
    try {
      await theiaService.deleteSession(appConfig.appId, userId, req.body.sessionName);
      return res.status(204).send({});
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
    // Handle get request
  } else if (req.method === 'GET') {
    try {
      const userSessionsList = await theiaService.getSessionsList(appConfig.appId, userId);
      /* let userSessionListWithMetrics;
      await Promise.all(
        (userSessionListWithMetrics = userSessionsList.map(async (session: any) => {
          session.sessionMetrics = await theiaService.getSessionMetricsList('asdfghjkl', session.name);
        }))
      ); */
      return res.status(200).send(userSessionsList);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }
}

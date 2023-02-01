import type { NextApiRequest, NextApiResponse } from 'next';
import { AdminWorkspaceCRData } from '../../../../../types/AdminWorkspaceCRData';
import appConfig from '../../../../../configs/app_config';
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  if (req.method === 'POST') {
    try {
      await Promise.all(
        req.body.toBeStartedSessions.map(async (workspace: AdminWorkspaceCRData) => {
          await theiaService.createSessionWithExistingWorkspace(
            appConfig.appId,
            workspace.user,
            workspace.name,
            workspace.appDefinition
          );
        })
      );
      return res.status(201).send({});
    } catch (error: any) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

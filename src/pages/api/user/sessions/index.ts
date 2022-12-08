// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Theia Service Client
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  const userId = req.headers['x-user-mail'];
  // Handle POST request
  if (req.method === 'POST') {
    let userWorkspaceList;
    if (!req.body.workspaceName) {
      userWorkspaceList = await theiaService.createSessionWithNewWorkspace(req.body.appId, userId);
    } else {
      userWorkspaceList = await theiaService.createSessionWithExistingWorkspace(
        req.body.appId,
        userId,
        req.body.workspaceName,
        req.body.appDefinition
      );
    }
    return res.status(200).send(userWorkspaceList);
    // Handle delete request
  } else if (req.method === 'DELETE') {
    await theiaService.deleteSession(req.body.appId, userId, req.body.sessionName);
    return res.status(204).send({});
    // Handle get request
  } else if (req.method === 'GET') {
    const userSessionsList = await theiaService.getSessionsList('asdfghjkl', userId);
    console.log('userSessionsList', userSessionsList);
    return res.status(200).send(userSessionsList);
  }
}

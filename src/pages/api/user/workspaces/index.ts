// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import appConfig from '../../../../../configs/app_config';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Theia Service Client
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  const userId = req.headers['x-user-mail'];
  if (req.method === 'GET') {
    try {
      const userWorkspaceList = await theiaService.getUserWorkspaceList(appConfig.appId, userId);
      return res.status(200).send(userWorkspaceList);
    } catch (error) {
      return res.status(500).send(error);
    }
    // Handle delete request
  } else if (req.method === 'DELETE') {
    try {
      const toBeDeletedWorkspaceNamesArr = req.body.toBeDeletedWorkspaces;
      await Promise.all(
        toBeDeletedWorkspaceNamesArr.map(async (workspaceName: string) => {
          await theiaService.deleteUserWorkspace(appConfig.appId, userId, workspaceName);
        })
      );
      return res.status(204).send({});
    } catch (error) {
      return res.status(400).send(error);
    }
    // Handle post request
  } else if (req.method === 'POST') {
    try {
      const mySessions = await theiaService.getSessionsList(appConfig.appId, userId);
      let createdWorkspace;
      if (mySessions.length > 0) {
        createdWorkspace = await theiaService.createUserWorkspace(appConfig.appId, userId, req.body.appDefinition);
      } else {
        createdWorkspace = await theiaService.createSessionWithNewWorkspace(
          appConfig.appId,
          userId,
          req.body.appDefinition
        );
      }
      return res.status(201).send(createdWorkspace);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

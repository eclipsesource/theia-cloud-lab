// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import type { NextApiRequest, NextApiResponse } from 'next';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Theia Service Client
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  const userId = req.headers['x-user-mail'];
  if (req.method === 'GET') {
    const userWorkspaceList = await theiaService.getUserWorkspaceList('asdfghjkl', userId);
    console.log('userWorkspaceList', userWorkspaceList);
    return res.status(200).send(userWorkspaceList);
    // Handle delete request
  } else if (req.method === 'DELETE') {
    const toBeDeletedWorkspaceNamesArr = req.body.toBeDeletedWorkspaces;
    await Promise.all(
      toBeDeletedWorkspaceNamesArr.map(async (workspaceName: string) => {
        await theiaService.deleteUserWorkspace(req.body.appId, userId, workspaceName);
      })
    );
    return res.status(204).send({});
    // Handle post request
  } else if (req.method === 'POST') {
    const createdWorkspace = await theiaService.createUserWorkspace('asdfghjkl', userId);
    return res.status(201).send(createdWorkspace);
  }
}

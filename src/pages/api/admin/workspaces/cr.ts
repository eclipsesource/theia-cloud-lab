// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import { AdminWorkspaceCRData } from '../../../../../types/AdminWorkspaceCRData';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import appConfig from '../../../../../configs/app_config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  const k8s = new KubernetesClient();
  const workspaceCRDataArray: AdminWorkspaceCRData[] = [];
  // Handle get request
  if (req.method === 'GET') {
    try {
      const data = await k8s.getWorkspaceList();
      data.body.items &&
        data.body.items.forEach((each: any) => {
          const name = each.metadata?.name;
          const creationTimestamp = each.metadata?.creationTimestamp;
          const uid = each.metadata?.uid;
          const appDefinition = each.spec?.appDefinition;
          const label = each.spec?.label;
          const storage = each.spec?.storage;
          const user = each.spec?.user;

          const workspaceCRData: AdminWorkspaceCRData = {
            name,
            creationTimestamp,
            uid,
            appDefinition,
            label,
            storage,
            user,
          };
          workspaceCRDataArray.push(workspaceCRData);
        });
      return res.status(200).send(workspaceCRDataArray);
    } catch (error) {
      return res.status(500).send(error);
    }
    // Handle delete request
  } else if (req.method === 'DELETE') {
    try {
      await Promise.all(
        req.body.toBeDeletedWorkspaces.map(
          async (workspace: AdminWorkspaceCRData) =>
            await theiaService.deleteUserWorkspace(appConfig.appId, workspace.user, workspace.name)
        )
      );

      return res.status(204).send({});
    } catch (error) {
      return res.status(500).send(error);
    }
    // Handle post request
  } else if (req.method === 'POST') {
    try {
      const createdWorkspace = await theiaService.createUserWorkspace(
        appConfig.appId,
        req.body.userId,
        req.body.appDefinition
      );

      return res.status(201).send(createdWorkspace);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

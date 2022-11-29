// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubernetesClient } from '../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type WorkspaceCRData = {
  name: string;
  creationTimestamp: string;
  uid: string;
  appDefinition: string;
  label: string;
  storage: string;
  user: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const k8s = new KubernetesClient()
  const workspaceCRDataArray: WorkspaceCRData[] = [];
  // Handle get request
  if (req.method === 'GET') {
    const data = await k8s.getWorkspaceList()
    data.body.items &&
      data.body.items.forEach((each: any) => {
        const name = each.metadata?.name;
        const creationTimestamp = each.metadata?.creationTimestamp;
        const uid = each.metadata?.uid;
        const appDefinition = each.spec?.appDefinition;
        const label = each.spec?.label;
        const storage = each.spec?.storage;
        const user = each.spec?.user;

        const workspaceCRData: WorkspaceCRData = {
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
    // Handle delete request
  } else if (req.method === 'DELETE') {
    const toBeDeletedWorkspaceNamesArr = req.body.toBeDeletedWorkspaces
    await Promise.all(toBeDeletedWorkspaceNamesArr.map(async (name: string) => {
      await k8s.deleteWorkspace(name)
    }))
    return res.status(204).send({})
    // Handle post request
  } else if (req.method === 'POST') {
    const wsName = req.body.toBeCreatedWorkspace
    const data = await k8s.createWorkspaceAndPersistentVolume(wsName)
    return res.status(201).send(data)
  }
}
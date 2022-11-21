// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';
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

export default function handler(req: NextApiRequest, res: NextApiResponse<WorkspaceCRData[]>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CustomObjectsApi);
  const workspaceCRDataArray: WorkspaceCRData[] = [];

  k8sApi.listNamespacedCustomObject('theia.cloud', 'v1beta', 'theiacloud', 'workspaces').then((data: any) => {
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
    res.send(workspaceCRDataArray);
  });
}

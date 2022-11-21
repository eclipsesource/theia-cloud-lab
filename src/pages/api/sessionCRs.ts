// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface ISessionCRData {
  creationTimestamp: string;
  name: string;
  namespace: string;
  resourceVersion: string;
  uid: string;
  appDefinition: string;
  url: string;
  user: string;
  workspace: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ISessionCRData[]>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CustomObjectsApi);

  const sessionCRDataArr: ISessionCRData[] = [];

  k8sApi.listNamespacedCustomObject('theia.cloud', 'v2beta', 'theiacloud', 'sessions').then((data: any) => {
    data.body.items &&
      data.body.items.forEach((each: any) => {
        const creationTimestamp = each.metadata?.creationTimestamp;
        const name = each.metadata?.name;
        const namespace = each.metadata?.namespace;
        const resourceVersion = each.metadata?.resourceVersion;
        const uid = each.metadata?.uid;
        const appDefinition = each.spec?.appDefinition;
        const url = each.spec?.url;
        const user = each.spec?.user;
        const workspace = each.spec?.workspace;

        const obj: ISessionCRData = {
          creationTimestamp,
          name,
          namespace,
          resourceVersion,
          uid,
          appDefinition,
          url,
          user,
          workspace,
        };
        sessionCRDataArr.push(obj);
      });

    res.send(sessionCRDataArr);
  });
}

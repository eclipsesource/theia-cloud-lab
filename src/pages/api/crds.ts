// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CoreV1Api, KubeConfig, ApiextensionsV1Api } from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<any[]>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(ApiextensionsV1Api);

  k8sApi.listCustomResourceDefinition().then((data: any) => {
    res.send(data.body);
  });
}

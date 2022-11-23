// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CustomObjectsApi);

  const { deleteSessionCRs } = req.query;
  const selectedRows = deleteSessionCRs && deleteSessionCRs[1].split(',');

  Array(selectedRows).forEach((each: any) => {
    k8sApi.deleteNamespacedCustomObject('theia.cloud', 'v2beta', 'theiacloud', 'sessions', each).then((data: any) => {
      res.send(data);
    });
  });
}

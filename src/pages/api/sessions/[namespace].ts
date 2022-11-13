// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CoreV1Api, KubeConfig, V1PodList } from '@kubernetes/client-node';
import { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  body: V1PodList;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const { namespace }: any = req.query;
  const k8sApi = kc.makeApiClient(CoreV1Api);
  k8sApi.listNamespacedPod(namespace).then((data: any) => {
    res.send(data.body);
  });
}

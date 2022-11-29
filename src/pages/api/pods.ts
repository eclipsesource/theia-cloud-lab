// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CoreV1Api, KubeConfig, Metrics, V1PodList, V1PodStatus, V1Volume } from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<V1PodList>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CoreV1Api);

  k8sApi.listNamespacedPod('theiacloud').then((data: any) => {
    const body: V1PodList = data.body;
    res.send(body);
  });
}

import { V1PersistentVolume } from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';

export default async function handler(req: NextApiRequest, res: NextApiResponse<V1PersistentVolume[]>) {
  const k8s = new KubernetesClient();
  if (req.method === 'GET') {
    try {
      const data = await k8s.getPersistentVolumeList();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}

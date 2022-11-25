import { KubernetesClient } from '../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any[]>) {
  const k8s = new KubernetesClient();
  const data = await k8s.getPersistentVolumeList();
  return res.status(200).send(data);
}
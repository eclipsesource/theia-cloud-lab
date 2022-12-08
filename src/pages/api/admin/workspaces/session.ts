import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const k8s = new KubernetesClient();
  if (req.method === 'POST') {
    const toBeRestartedSessionNameArr = req.body.toBeRestartedSessions;
    await Promise.all(
      toBeRestartedSessionNameArr.map(async (name: string) => {
        await k8s.createSession(`ns-${name}`, name);
      })
    );
    return res.status(201).send({});
  }
}

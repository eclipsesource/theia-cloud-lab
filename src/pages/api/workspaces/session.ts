import { KubernetesClient } from '../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
const randomId = randomUUID();

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

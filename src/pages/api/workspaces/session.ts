import { KubernetesClient } from '../../../../utils/k8s/k8s_client';
import { TheiaServiceClient } from '../../../../utils/theiaservice/theiaservice_client';
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
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const k8s = new KubernetesClient();
  const tsc = new TheiaServiceClient(req.headers['x-access-token']);
  if (req.method === 'POST') {
    const toBeRestartedSessionNameArr = req.body.toBeRestartedSessions;
    await Promise.all(
      toBeRestartedSessionNameArr.map(async (name: string) => {
        await k8s.createSession(`ns-${name}`, name);
      })
    );
    return res.status(201).send({});
  } else if (req.method === 'GET') {
    console.log('im here')
    const result = await tsc.checkIfServiceAliveWithAppId('asdfghjkl');
    return res.status(200).send(result);
  }
}

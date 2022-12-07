import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';

export type SessionCRData = {
  creationTimestamp: string;
  name: string;
  namespace: string;
  resourceVersion: string;
  uid: string;
  appDefinition: string;
  url: string;
  user: string;
  workspace: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const k8s = new KubernetesClient();
  const userTypeInformation = req.headers['x-access-type'];
  console.log(userTypeInformation);
  // Handle get request
  if (req.method === 'GET') {
    const data = await k8s.getSessionList();
    const sessionCRDataArr: SessionCRData[] = [];
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

        const obj: SessionCRData = {
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
    return res.status(200).send(sessionCRDataArr);

    // Handle delete request
  } else if (req.method === 'DELETE') {
    const toBeDeletedSessionNamesArr = req.body.toBeDeletedSessions;
    await Promise.all(
      toBeDeletedSessionNamesArr.map(async (name: string) => {
        await k8s.deleteSession(name);
      })
    );
    return res.status(204).send({});

    // Handle post request
  } else if (req.method === 'POST') {
    const randomId = randomUUID();
    const workspace = await k8s.createWorkspaceAndPersistentVolume(randomId);
    let sessionName = `ws-${randomId}-session`;
    const data = await k8s.createSession(sessionName, workspace.body.metadata.name);
    return res.status(201).send(data.body);
  }
}

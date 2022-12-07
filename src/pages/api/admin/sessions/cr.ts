import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import { ISessionCRData } from '../../../../../types/ISessionCRData';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
const randomId = randomUUID();


export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const k8s = new KubernetesClient();
  const userTypeInformation = req.headers['x-access-type'];
  console.log(userTypeInformation);
  // Handle get request
  if (req.method === 'GET') {
    const data = await k8s.getSessionList();
    const sessionCRDataArr: ISessionCRData[] = [];
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

        const obj: ISessionCRData = {
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

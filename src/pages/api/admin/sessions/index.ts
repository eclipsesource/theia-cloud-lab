import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import appConfig from '../../../../../configs/app_config';
import { AdminSessionCRData } from '../../../../../types/AdminSessionCRData';

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

// TODO: Remove this line when the certificate issue is fixed
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  const k8s = new KubernetesClient();
  // Handle get request
  if (req.method === 'GET') {
    try {
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
    } catch (error) {
      return res.status(500).send(error);
    }
    // Handle delete request
  } else if (req.method === 'DELETE') {
    try {
      await Promise.all(
        req.body.toBeDeletedSessions.map(async (session: AdminSessionCRData) => {
          await theiaService.deleteSession(appConfig.appId, session.user, session.name);
        })
      );
      return res.status(204).send({});
    } catch (error) {
      return res.status(400).send(error);
    }
    // Handle post request
  } else if (req.method === 'POST') {
    try {
      const userId = req.body.userId;
      const newSession = await theiaService.createSessionWithNewWorkspace(
        appConfig.appId,
        userId,
        req.body['appDefinition']
      );
      return res.status(200).send(newSession);
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
}

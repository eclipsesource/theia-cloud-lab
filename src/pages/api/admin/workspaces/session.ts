import type { NextApiRequest, NextApiResponse } from 'next';
import { AdminWorkspaceCRData } from '../../../../../types/AdminWorkspaceCRData';
// import appConfig from '../../../../../configs/app_config';
import hostConfig from '../../../../../configs/ws_config';
// import { TheiaServiceClient } from '../../../../../utils/theiaservice/theiaservice_client';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const theiaService = new TheiaServiceClient(req.headers['x-access-token']);
  const k8s = new KubernetesClient();
  if (req.method === 'POST') {
    try {
      await Promise.all(
        req.body.toBeStartedSessions.map(async (workspace: AdminWorkspaceCRData) => {
          let sessionName = workspace.name + '-session'
          let sessionUrl = hostConfig.hostUrl + '/' + workspace.uid + '/'
          await k8s.createSession(sessionName, workspace.name, workspace.appDefinition, sessionUrl, workspace.user);
          // Theia Cloud Service is checking some keycloak configurations, our roles are maybe not recognized by your service api. 
          // After arranging that you can change it to theia api back again.
          // await theiaService.createSessionWithExistingWorkspace(
          //   appConfig.appId,
          //   workspace.user,
          //   workspace.name,
          //   workspace.appDefinition
          // );
        })
      );
      return res.status(201).send({});
    } catch (error: any) {
      console.log(error)
      return res.status(400).send(error);
    }
  }
}

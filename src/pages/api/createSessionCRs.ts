// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';
import { randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CustomObjectsApi);
  // let workspaceName = '';
  // let appDefinitionName = '';

  // k8sApi
  //   .createNamespacedCustomObject('theia.cloud', 'v1beta', 'theiacloud', 'workspaces', {
  //     kind: 'Workspace',
  //     apiVersion: 'theia.cloud/v1beta',
  //     metadata: {
  //       name: 'addf1ds',
  //     },
  //     items: [{}],
  //   })
  //   .then((data: any) => {
  //     res.send(data);
  //   });

  // k8sApi.listNamespacedCustomObject('theia.cloud', 'v2beta', 'theiacloud', 'appdefinitions').then((data: any) => {
  //   data.body.items &&
  //     data.body.items.forEach((each: any) => {
  //       const appDefinition = each.spec?.appDefinition;
  //       appDefinitionName = appDefinition;
  //     });
  // });

  const randomId = randomUUID();

  k8sApi
    .createNamespacedCustomObject('theia.cloud', 'v2beta', 'theiacloud', 'sessions', {
      kind: 'Session',
      apiVersion: 'theia.cloud/v2beta',
      metadata: {
        name: `ws-${randomId}-session`,
        workspace: 'workspaceName',
      },
      spec: {
        namespace: 'theiacloud',
        appDefinition: 'theia-cloud-demo',
        name: `ws-${randomId}-session`,
        workspace: `ws-${randomId}`,
      },
    })
    .then((data: any) => {
      res.send(data.body);
    });
}

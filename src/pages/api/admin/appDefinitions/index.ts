// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // K8s Service Client
  const k8sService = new KubernetesClient();
  // const userId = req.headers['x-user-mail'];
  // Handle GET request
  if (req.method === 'GET') {
    try {
      const appDefsList = await k8sService.getAppDefinitionsList();
      await Promise.all(
        appDefsList.body.items.map(async (item: any) => {
          item.value = item.metadata.name;
          item.label = item.metadata.name;
          item.name = item.metadata.name;
          item.image = item.spec.image;
          item.port = item.spec.port;
          item.requestsCpu = item.spec.requestsCpu;
          item.requestsMemory = item.spec.requestsMemory;
          item.limitsMemory = item.spec.limitsMemory;
          item.limitsCpu = item.spec.limitsCpu;
          item.timeout = item.spec.timeout.limit;
          item.maxInstances = item.spec.maxInstances;
          item.minInstances = item.spec.minInstances;
        })
      );
      return res.status(200).send(appDefsList.body.items);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
    // Handle delete request
  } else if (req.method === 'PATCH') {
    try {
      const patchedAppDef = await k8sService.editAppDefinition(
        req.body.name, // 'cdt-cloud-demo',
        req.body.image, // 'theiacloud/cdt-blueprint',
        req.body.port, // 3000, !!!INTEGER
        req.body.requestsCPU, // '100m',
        req.body.requestsMemory, // '1000M',
        req.body.limitsMemory, // '1200M',
        req.body.limitsCpu, // 'limitsCpu',
        req.body.timeout, // 45 !!!INTEGER
        req.body.minInstances,
        req.body.maxInstances
      );
      return res.status(200).send(patchedAppDef);
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  } else if (req.method === 'POST') {
    try {
      const newAppDefinition = await k8sService.createAppDefinition(
        req.body.name, // examples: 'cdt-cloud-demo', 'coffee-editor'
        req.body.image // examples: 'theiacloud/cdt-blueprint', 'eu.gcr.io/kubernetes-238012/coffee-editor:v0.7.14'
      );
      return res.status(201).send(newAppDefinition);
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  } else if (req.method === 'DELETE') {
    try {
      const toBeDeletedAppDefinition = await k8sService.deleteAppDefinition(req.body.toBeDeletedAppDefinition);
      return res.status(204).send(toBeDeletedAppDefinition);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }
}

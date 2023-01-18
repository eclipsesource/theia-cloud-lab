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
      return res.status(200).send(appDefsList.body.items);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
    // Handle delete request
  } else if (req.method === 'DELETE') {
  } else if (req.method === 'POST') {
    try {
      // not stable
      const newAppDefinition = await k8sService.createAppDefinition();
      console.log(newAppDefinition)
      return res.status(201).send(newAppDefinition);
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
}

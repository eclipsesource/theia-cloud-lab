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
      const filteredArr: any = [];
      await Promise.all(
        appDefsList.body.items.map(async (item: any) => {
          let objToAdd = {
            value: item.metadata.name,
            label: item.metadata.name,
          };
          filteredArr.push(objToAdd);
        })
      );
      return res.status(200).send(filteredArr);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
    // Handle delete request
  }
}
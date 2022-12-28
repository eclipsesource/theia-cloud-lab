// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { KubeConfig, Metrics } from '@kubernetes/client-node';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';

let intervalId: NodeJS.Timer | undefined = undefined;
const kc = new KubeConfig();
kc.loadFromDefault();
const metricsClient = new Metrics(kc);
const k8s = new KubernetesClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      if (req.body['start'] && intervalId === undefined) {
        intervalId = setInterval(async () => {
          const metrics = await metricsClient.getPodMetrics('theiacloud');
          const sessionList = await k8s.getSessionList();
          for (const session of sessionList.body.items) {
            for (const podMetric of metrics.items) {
              if (podMetric.metadata?.name.includes(session.metadata?.uid)) {
                // Matched podMetric with session
                // Update Database
                const tableName = session.metadata.name;
                console.log('podMetric', podMetric);
                console.log('session', session);
              }
            }
          }
        }, 10000);
        return res.status(200).json('Started fetching metrics at 1s interval');
      } else if (req.body['stop'] && intervalId !== undefined) {
        clearInterval(intervalId);
        intervalId = undefined;
        return res.status(200).send('Stopped fetching metrics');
      } else {
        return res.status(400).send('Bad request');
      }
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const metrics = await metricsClient.getPodMetrics('theiacloud');
      return res.status(200).json(metrics.items);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

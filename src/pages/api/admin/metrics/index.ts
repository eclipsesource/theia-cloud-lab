// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ContainerMetric, KubeConfig, Metrics } from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IPodMetric {
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    creationTimestamp: string;
    labels: {
      [key: string]: string;
    };
  };
  timestamp: string;
  window: string;
  containers: ContainerMetric[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<any[]>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const metricsClient = new Metrics(kc);
  metricsClient.getPodMetrics('theiacloud').then((metrics) => {
    res.send(metrics.items);
  });

  // topPods(k8sApi, metricsClient, 'theiacloud').then((pods) => {
  //   const podsColumns = pods.map((pod) => {
  //     return {
  //       POD: pod.Pod.metadata?.name,
  //       CPU: Number(pod.CPU.CurrentUsage),
  //       MEMORY: Number(pod.Memory.CurrentUsage),
  //     };
  //   });
  //   res.send(podsColumns);
  // });
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  CoreV1Api,
  KubeConfig,
  Metrics,
  topPods,
  V1PodList,
  V1PodStatus,
  SinglePodMetrics,
} from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

export type SessionData = {
  app: string;
  metrics: SinglePodMetrics;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CoreV1Api);
  const metricsClient = new Metrics(kc);
  topPods(k8sApi, metricsClient, 'default').then((pods) => {
    const podsColumns = pods.map((pod) => {
      return {
        POD: pod.Pod.metadata?.name,
        'CPU(cores)': pod.CPU.CurrentUsage,
        'MEMORY(bytes)': pod.Memory.CurrentUsage,
      };
    });

    console.log(podsColumns);
  });
}

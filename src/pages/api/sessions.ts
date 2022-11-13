// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CoreV1Api, KubeConfig, Metrics, V1PodList, V1PodStatus, SinglePodMetrics } from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';

export type SessionData = {
  app: string;
  hostIP: string | undefined;
  phase: string | undefined;
  podIP: string | undefined;
  qosClass: string | undefined;
  startTime: Date | undefined;
};

const sessionRegex = /^ws-.*-session/g;

export default function handler(req: NextApiRequest, res: NextApiResponse<SessionData[]>) {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CoreV1Api);

  const sessionArr: SessionData[] = [];

  k8sApi.listNamespacedPod('theiacloud').then((data: any) => {
    const body: V1PodList = data.body;
    body.items.forEach(async (each) => {
      const labels = each.metadata?.labels;
      const sessionString = labels?.app;
      if (sessionString?.match(sessionRegex)) {
        const { hostIP, phase, podIP, qosClass, startTime }: V1PodStatus = each.status!;
        const obj: SessionData = {
          app: sessionString,
          hostIP,
          phase,
          podIP,
          qosClass,
          startTime,
        };
        sessionArr.push(obj);
      }
    });
    res.send(sessionArr);
  });
}

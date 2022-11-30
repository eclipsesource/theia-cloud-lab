import { V1PodList, V1PodStatus } from '@kubernetes/client-node';
import { KubernetesClient } from '../../../../utils/k8s/k8s_client';
import { SessionData } from '../../../../types/SessionData';
import type { NextApiRequest, NextApiResponse } from 'next';

const sessionRegex = /^ws-.*-session/g;

export default async function handler(req: NextApiRequest, res: NextApiResponse<SessionData[]>) {
  const k8s = new KubernetesClient();
  const sessionArr: SessionData[] = [];

  const data = await k8s.getNamespacedPodList();

  const body: V1PodList = data.body;
  body.items.forEach(async (each) => {
    const labels = each.metadata?.labels;
    const name = each.metadata?.name;
    const workspaceVolumes = each.spec?.volumes;
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
        podName: name,
        workspaceVolumes,
      };
      sessionArr.push(obj);
    }
  });
  res.send(sessionArr);
}

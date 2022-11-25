import { V1PodList, V1PodStatus, V1Volume } from '@kubernetes/client-node';
import { KubernetesClient } from '../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type SessionData = {
    app: string;
    hostIP: string | undefined;
    phase: string | undefined;
    podIP: string | undefined;
    qosClass: string | undefined;
    startTime: Date | undefined;
    podName: string | undefined;
    workspaceVolumes: Array<V1Volume> | undefined;
};

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

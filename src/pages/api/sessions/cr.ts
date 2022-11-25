import { KubernetesClient } from '../../../../utils/k8s/k8s_client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
const randomId = randomUUID();

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const k8s = new KubernetesClient();
    // Handle get request
    if (req.method === 'GET') {
        const data = await k8s.getCustomResourceDefinitionList();
        return res.status(200).send(data.body);

        // Handle delete request
    } else if (req.method === 'DELETE') {
        const toBeDeletedSessionNamesArr = req.body.toBeDeletedSessions
        await Promise.all(toBeDeletedSessionNamesArr.map(async (name: string) => {
            await k8s.deleteSession(name)
        }));
        return res.status(204).send({});

        // Handle post request
    } else if (req.method === 'POST') {
        const randomId = randomUUID();
        const workspace = await k8s.createWorkspaceAndPersistentVolume(randomId);
        let sessionName = `ws-${randomId}-session`
        const data = await k8s.createSession(sessionName, workspace.body.metadata.name);
        return res.status(201).send(data.body);
    }

}

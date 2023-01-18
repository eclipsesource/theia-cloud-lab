import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { AdminWorkspaceCRData } from '../../../../../types/AdminWorkspaceCRData';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';

const globalUsage = 'GLOBAL USAGE';
const globalSessions = 'GLOBAL SESSIONS';
const globalWorkspaces = 'GLOBAL WORKSPACES';
const globalWorkspaceList = 'GLOBAL WORKSPACE LIST';

const questdbClient = new Client({
  database: 'qdb',
  host: '127.0.0.1',
  password: 'quest',
  port: 8812,
  user: 'admin',
});

questdbClient.connect();

const k8s = new KubernetesClient();

type WorkspaceList = {
  name: string;
  user: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const sessionList = await questdbClient.query(`SELECT * FROM '${globalSessions}'`);
        const usageList = await questdbClient.query(`SELECT * FROM '${globalUsage}'`);
        const workspaceList = await questdbClient.query(`SELECT * FROM '${globalWorkspaces}'`);

        // get workspace list from global workspaces list from database
        const workspaces = await questdbClient.query(`SELECT * FROM '${globalWorkspaceList}' WHERE isDeleted = false`);
        const workspaceListFromK8s = await k8s.getWorkspaceList();
        let workspaceListFromK8sArray: WorkspaceList[] = [];

        for (const row of workspaces.rows) {
          workspaceListFromK8s.body.items &&
            workspaceListFromK8s.body.items.forEach((each: any) => {
              const name = each.metadata?.name;
              if (name === row.name) {
                workspaceListFromK8sArray.push({ name, user: row.userId });
              }
            });
        }

        let allWorkspaceList = [];

        for (const each of workspaceListFromK8sArray) {
          const res = await questdbClient.query(`SELECT * FROM '${each.name}'`);
          allWorkspaceList.push({ workspace: each.name, user: each.user, data: res.rows });
        }

        console.log(allWorkspaceList);

        const rows = [sessionList.rows, usageList.rows, workspaceList.rows, allWorkspaceList];
        return res.status(200).json({ rows });
      } catch (error) {
        return res.status(400).json('Error getting statistics');
      }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

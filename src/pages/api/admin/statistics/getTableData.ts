import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { DB_TABLE_NAMES } from '../../../../../types/Database';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';

const k8s = new KubernetesClient();

type WorkspaceList = {
  name: string;
  user: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log(req.method);
  if (
    req.method === 'POST' &&
    req.body &&
    req.body.tableName &&
    !req.body.isPerUser &&
    typeof req.body.tableName === 'string'
  ) {
    try {
      const questdbClient = new Client({
        database: 'qdb',
        host: '127.0.0.1',
        password: 'quest',
        port: 8812,
        user: 'admin',
      });
      await questdbClient.connect();
      const data = await questdbClient.query(`SELECT * FROM '${req.body.tableName}'`);
      await questdbClient.end();
      return res.status(200).send(data.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else if (req.method === 'POST' && req.body && req.body.tableName && req.body.isPerUser) {
    try {
      const questdbClient = new Client({
        database: 'qdb',
        host: '127.0.0.1',
        password: 'quest',
        port: 8812,
        user: 'admin',
      });
      await questdbClient.connect();
      const globalWorkspaceList = await questdbClient.query(
        `SELECT * FROM '${DB_TABLE_NAMES.GLOBAL_WORKSPACE_LIST}' WHERE isDeleted = false`
      );
      const workspaceListFromK8s = await k8s.getWorkspaceList();

      let workspaceListFromK8sArray: WorkspaceList[] = [];

      for (const row of globalWorkspaceList.rows) {
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

      await questdbClient.end();

      return res.status(200).send(allWorkspaceList);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}

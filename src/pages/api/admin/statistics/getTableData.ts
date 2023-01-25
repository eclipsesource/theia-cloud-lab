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

      const workspaceListFromK8s = await k8s.getWorkspaceList();
      let allWorkspaceList: any = [];

      workspaceListFromK8s.body.items &&
        workspaceListFromK8s.body.items.forEach((each: any) => {
          const name = each.metadata?.name;
          allWorkspaceList.push({
            workspace: name,
            user: each.spec?.user,
            data: [],
            totalCPUUsage: 0,
            totalMemoryUsage: 0,
          });
        });

      const regex = /(\d*)(\D*)/;
      for (const each of allWorkspaceList) {
        try {
          const selectWorkspace = await questdbClient.query(`SELECT * FROM '${each.workspace}'`);
          if (selectWorkspace.rows.length > 0) {
            each.data = selectWorkspace.rows;
            each.totalCPUUsage = selectWorkspace.rows.reduce(
              (a: any, b: any) => Number(a) + Number(b.cpu.match(regex)[1]),
              0
            );
            each.totalMemoryUsage = selectWorkspace.rows.reduce(
              (a: any, b: any) => Number(a) + Number(b.memory.match(regex)[1]),
              0
            );
          }
        } catch (error) {
          console.log('No Table Found');
        }
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

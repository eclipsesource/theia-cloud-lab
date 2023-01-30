import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { DB_TABLE_NAMES } from '../../../../../types/Database';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const questdbClient = new Client({
    database: 'qdb',
    host: '127.0.0.1',
    password: 'quest',
    port: 8812,
    user: 'admin',
  });
  if (req.method === 'GET' && req.query.graphInfo === 'topTenAppCPUConsumingDefs') {
    try {
      await questdbClient.connect();
      const data = await questdbClient.query(
        `SELECT name, MAX(totalcpu) AS max_cpu FROM '${DB_TABLE_NAMES.GLOBAL_APP_DEFINITIONS}' GROUP BY name ORDER BY max_cpu DESC LIMIT 10`
      );
      await questdbClient.end();

      return res.status(200).send(data.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else if (req.method === 'GET' && req.query.graphInfo === 'topTenAppMemoryConsumingDefs') {
    try {
      await questdbClient.connect();
      const data = await questdbClient.query(
        `SELECT name, MAX(totalmemory) AS max_mem FROM '${DB_TABLE_NAMES.GLOBAL_APP_DEFINITIONS}' GROUP BY name ORDER BY max_mem DESC LIMIT 10`
      );
      await questdbClient.end();

      return res.status(200).send(data.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else if (req.method === 'GET' && req.query.graphInfo === 'mostPopularAppDefs') {
    try {
      await questdbClient.connect();
      /*
        Gives the app definition with the most ws number for every minute (1 minute intervals)
      */
      const data = await questdbClient.query(
        `WITH cte AS (
            SELECT DATE_TRUNC('minute', ts) as minute_ts, name, wscount, ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('minute', ts) ORDER BY wscount DESC) as row_num
            FROM  '${DB_TABLE_NAMES.GLOBAL_APP_DEFINITIONS}' )
            SELECT minute_ts, name, wscount
            FROM cte
            WHERE row_num = 1
            ORDER BY minute_ts DESC`
      );
      await questdbClient.end();
      return res.status(200).send(data.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else if (req.method === 'GET' && req.query.graphInfo === 'averageCPUConsumption') {
    try {
      const k8sService = new KubernetesClient();
      const appDefsList = await k8sService.getAppDefinitionsList();
      const returnObj: any = {};
      await questdbClient.connect();
      await Promise.all(
        appDefsList.body.items.map(async (item: any) => {
          const data = await questdbClient.query(
            `SELECT ts, name, wscount, sessioncount, totalcpu,
            CASE
            WHEN sessioncount = 0 THEN 0
            ELSE totalcpu/sessioncount
          END as averagecpu
                FROM '${DB_TABLE_NAMES.GLOBAL_APP_DEFINITIONS}' 
                WHERE name = '${item.metadata?.name}'`
          );
          returnObj[item.metadata?.name] = data.rows;
        })
      );
      await questdbClient.end();
      return res.status(200).send(returnObj);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else if (req.method === 'GET' && req.query.graphInfo === 'averageMemoryConsumption') {
    try {
      const k8sService = new KubernetesClient();
      const appDefsList = await k8sService.getAppDefinitionsList();
      const returnObj: any = {};
      // const returnArr:any = []
      await questdbClient.connect();
      await Promise.all(
        appDefsList.body.items.map(async (item: any) => {
          const data = await questdbClient.query(
            `SELECT ts, name, wscount, sessioncount, totalmemory,
                CASE
                  WHEN sessioncount = 0 THEN 0
                  ELSE totalmemory/sessioncount
                END as averagememory
                FROM '${DB_TABLE_NAMES.GLOBAL_APP_DEFINITIONS}' 
                WHERE name = '${item.metadata?.name}'`
          );
          returnObj[item.metadata?.name] = data.rows;
          // returnArr.push(data.rows)
          // console.log(returnArr)
        })
      );
      await questdbClient.end();
      return res.status(200).send(returnObj);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else if (req.method === 'POST' && req.query.graphInfo === 'tableData') {
    try {
      if (!req.body.endDate) {
        req.body.endDate = new Date().toISOString();
      }
      if (!req.body.startDate) {
        const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        req.body.startDate = sevenDaysAgo.toISOString();
      }
      await questdbClient.connect();
      const data = await questdbClient.query(
        `SELECT name as id, SUM(wscount) as sum_ws, SUM(sessioncount) as sum_session, SUM(totalcpu) AS sum_cpu, SUM(totalmemory) AS sum_mem, 
        SUM(totalcpu) / SUM(sessioncount) as relative_cpu, SUM(totalmemory)/SUM(sessioncount) as relative_memory 
        FROM '${DB_TABLE_NAMES.GLOBAL_APP_DEFINITIONS}'
        WHERE ts >= '${req.body.startDate}' AND ts <= '${req.body.endDate}'
        GROUP BY id`
      );
      
      await questdbClient.end();
      return res.status(200).send(data.rows);
    } catch (error) {
      return res.status(500).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}

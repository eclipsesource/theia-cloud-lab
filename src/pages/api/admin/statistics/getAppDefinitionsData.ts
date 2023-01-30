import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { DB_TABLE_NAMES } from '../../../../../types/Database';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST' && req.body.graphInfo === 'topTenAppCPUConsumingDefs') {
    try {
      const questdbClient = new Client({
        database: 'qdb',
        host: '127.0.0.1',
        password: 'quest',
        port: 8812,
        user: 'admin',
      });
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
  } else if (req.method === 'POST' && req.body.graphInfo === 'topTenAppMemoryConsumingDefs') {
    try {
      const questdbClient = new Client({
        database: 'qdb',
        host: '127.0.0.1',
        password: 'quest',
        port: 8812,
        user: 'admin',
      });
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
  } else if (req.method === 'POST' && req.body.graphInfo === 'mostPopularAppDefs') {
    try {
      const questdbClient = new Client({
        database: 'qdb',
        host: '127.0.0.1',
        password: 'quest',
        port: 8812,
        user: 'admin',
      });
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
  } else if (req.method === 'POST' && req.body.graphInfo === 'averageConsumption') {
    try {
      const questdbClient = new Client({
        database: 'qdb',
        host: '127.0.0.1',
        password: 'quest',
        port: 8812,
        user: 'admin',
      });
      await questdbClient.connect();

      const data = await questdbClient.query(
        `SELECT ts, name, wscount, sessioncount, totalcpu, totalmemory, 
        CASE
          WHEN wscount = 0 THEN 0
          ELSE totalcpu/wscount
        END as averagecpu,
        CASE
          WHEN wscount = 0 THEN 0
          ELSE totalmemory/wscount
        END as averagememory
        FROM '${DB_TABLE_NAMES.GLOBAL_APP_DEFINITIONS}' ORDER BY ts DESC`
      );
      await questdbClient.end();

      return res.status(200).send(data.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}

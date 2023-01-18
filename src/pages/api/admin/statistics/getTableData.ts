import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { DB_TABLE_NAMES } from '../../../../../types/Database';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST' && req.body && req.body.tableName && typeof req.body.tableName === 'string') {
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
  } else if (req.method === 'POST' && req.body && req.body.globalTables) {
    try {
      const questdbClient = new Client({
        database: 'qdb',
        host: '127.0.0.1',
        password: 'quest',
        port: 8812,
        user: 'admin',
      });
      await questdbClient.connect();
      const sessionsData = await questdbClient.query(`SELECT * FROM '${DB_TABLE_NAMES.GLOBAL_SESSIONS}'`);
      const workspacesData = await questdbClient.query(`SELECT * FROM '${DB_TABLE_NAMES.GLOBAL_WORKSPACES}'`);
      const globalUsageData = await questdbClient.query(`SELECT * FROM '${DB_TABLE_NAMES.GLOBAL_USAGE}'`);
      await questdbClient.end();

      const data = {
        sessions: sessionsData.rows,
        workspaces: workspacesData.rows,
        usage: globalUsageData.rows,
      };
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send([]);
    }
  } else {
    return res.status(405).send([]);
  }
}

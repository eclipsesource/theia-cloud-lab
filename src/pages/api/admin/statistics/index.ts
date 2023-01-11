import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

const globalUsage = 'GLOBAL USAGE';
const globalSessions = 'GLOBAL SESSIONS';
const globalWorkspaces = 'GLOBAL WORKSPACES';

const questdbClient = new Client({
  database: 'qdb',
  host: '127.0.0.1',
  password: 'quest',
  port: 8812,
  user: 'admin',
});

questdbClient.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const sessionList = await questdbClient.query(`SELECT * FROM '${globalSessions}'`);
        const usageList = await questdbClient.query(`SELECT * FROM '${globalUsage}'`);
        const workspaceList = await questdbClient.query(`SELECT * FROM '${globalWorkspaces}'`);

        const rows = [sessionList.rows, usageList.rows, workspaceList.rows];
        return res.status(200).json({ rows });
      } catch (error) {
        return res.status(400).json('Error getting statistics');
      }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

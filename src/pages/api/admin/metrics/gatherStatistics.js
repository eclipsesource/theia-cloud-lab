// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubeConfig, Metrics } from '@kubernetes/client-node';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import dayjs from 'dayjs';

// This API has to be a .js file, since we are using Node.js global variables.

const kc = new KubeConfig();
kc.loadFromDefault();
const metricsClient = new Metrics(kc);
const k8s = new KubernetesClient();

const globalUsage = 'GLOBAL USAGE';
const globalSessions = 'GLOBAL SESSIONS';
const globalWorkspaces = 'GLOBAL WORKSPACES';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      if (req.body['start'] === true && loggingIntervalId === undefined) {
        loggingIntervalId = setInterval(async () => {
          let globalCPUUsage = 0;
          let globalMemoryUsage = 0;

          const metrics = await metricsClient.getPodMetrics('theiacloud');
          const sessionList = await k8s.getSessionList();
          const workspaceList = await k8s.getWorkspaceList();

          await questdbClient.query(`INSERT INTO '${globalSessions}' VALUES($1, $2);`, [
            dayjs().toISOString(),
            sessionList.body.items.length,
          ]);

          await questdbClient.query(`INSERT INTO '${globalWorkspaces}' VALUES($1, $2);`, [
            dayjs().toISOString(),
            workspaceList.body.items.length,
          ]);

          for (const session of sessionList.body.items) {
            for (const podMetric of metrics.items) {
              if (podMetric.metadata?.name.includes(session.metadata?.uid)) {
                const tableName = session.metadata.name;
                const createTable = await questdbClient.query(
                  `CREATE TABLE IF NOT EXISTS '${tableName}' (ts TIMESTAMP, cpu STRING, memory STRING) timestamp(ts);`
                );
                console.log(createTable);

                let totalCpuUsage = 0;
                let totalMemoryUsage = 0;
                let cpuUnit = '';
                let memoryUnit = '';
                for (const container of podMetric.containers) {
                  const matchesMemoryString = container.usage.memory.match(/(\d*)(\D*)/);
                  const matchesCPUString = container.usage.cpu.match(/(\d*)(\D*)/);
                  if (matchesMemoryString && matchesMemoryString[2]) {
                    memoryUnit = matchesMemoryString[2];
                  }
                  if (matchesCPUString && matchesCPUString[2]) {
                    cpuUnit = matchesCPUString[2];
                  }
                  if (matchesMemoryString && matchesMemoryString[1]) {
                    totalMemoryUsage = totalMemoryUsage + Number(matchesMemoryString[1]);
                  }
                  if (matchesCPUString && matchesCPUString[1]) {
                    totalCpuUsage = totalCpuUsage + Number(matchesCPUString[1]);
                  }
                }

                const insertData = await questdbClient.query(`INSERT INTO '${tableName}' VALUES($1, $2, $3);`, [
                  dayjs().toISOString(),
                  totalCpuUsage + cpuUnit,
                  totalMemoryUsage + memoryUnit,
                ]);

                console.log(insertData);

                globalCPUUsage = globalCPUUsage + totalCpuUsage;
                globalMemoryUsage = globalMemoryUsage + totalMemoryUsage;

                /* console.log('podMetric', podMetric);
                console.log('session', session); */
              }
            }
          }
          // TODO: Figure out calculation of metrics units
          const insertData = await questdbClient.query(`INSERT INTO '${globalUsage}' VALUES($1, $2, $3);`, [
            dayjs().toISOString(),
            globalCPUUsage + 'n',
            globalMemoryUsage + 'Ki',
          ]);
          await questdbClient.query('COMMIT');
        }, 60000);
        return res.status(200).json('Started fetching metrics at 1s interval');
      } else if (req.body['stop'] === true && loggingIntervalId !== undefined) {
        clearInterval(loggingIntervalId);
        loggingIntervalId = undefined;
        return res.status(200).json('Stopped fetching metrics');
      } else {
        return res.status(400).json('Bad request');
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      if (loggingIntervalId === undefined) {
        return res.status(200).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

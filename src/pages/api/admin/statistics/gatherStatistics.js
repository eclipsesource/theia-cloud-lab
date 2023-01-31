// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KubeConfig, Metrics } from '@kubernetes/client-node';
import { KubernetesClient } from '../../../../../utils/k8s/k8s_client';
import dayjs from 'dayjs';
import { Client } from 'pg';

// This API has to be a .js file, since we are using Node.js global variables.

const kc = new KubeConfig();
kc.loadFromDefault();
const metricsClient = new Metrics(kc);
const k8s = new KubernetesClient();

const globalUsage = 'GLOBAL USAGE';
const globalSessions = 'GLOBAL SESSIONS';
const globalWorkspaces = 'GLOBAL WORKSPACES';
const globalAppDefs = 'GLOBAL APP DEFINITIONS';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      if (
        req.body['start'] === true &&
        loggingIntervalId === undefined &&
        Number(req.body.globalDataRetentionWindow) > 0 &&
        Number(req.body.globalDataRetentionWindow) < 16 &&
        Number(req.body.workspaceDataRetentionWindow) > 0 &&
        Number(req.body.workspaceDataRetentionWindow) < 16
      ) {
        console.log('Started logging metrics');
        globalDataRetentionWindow = Number(req.body.globalDataRetentionWindow);
        workspaceDataRetentionWindow = Number(req.body.workspaceDataRetentionWindow);
        console.log('globalDataRetentionWindow = ', globalDataRetentionWindow);
        console.log('workspaceDataRetentionWindow = ', workspaceDataRetentionWindow);
        loggingIntervalId = setInterval(async () => {
          const questdbClient = new Client({
            database: 'qdb',
            host: '127.0.0.1',
            password: 'quest',
            port: 8812,
            user: 'admin',
          });
          await questdbClient.connect();

          let globalCPUUsage = 0;
          let globalMemoryUsage = 0;

          const metrics = await metricsClient.getPodMetrics('theiacloud');
          const sessionList = await k8s.getSessionList();
          const workspaceList = await k8s.getWorkspaceList();
          const appDefinitionList = await k8s.getAppDefinitionsList();

          // Log number of sessions and workspaces to their respective tables
          await questdbClient.query(`INSERT INTO '${globalSessions}' VALUES($1, $2);`, [
            dayjs().toISOString(),
            sessionList.body.items.length,
          ]);
          await questdbClient.query(`INSERT INTO '${globalWorkspaces}' VALUES($1, $2);`, [
            dayjs().toISOString(),
            workspaceList.body.items.length,
          ]);

          // Data retention policy for global tables
          // TODO: Add data retention policy for global workspace list table(costly operation)
          try {
            await questdbClient.query(
              `ALTER TABLE '${globalSessions}' DROP PARTITION WHERE ts < dateadd('d', -${globalDataRetentionWindow}, now());`
            );
          } catch (error) {
            // No partitions to drop for global sessions table
          }
          try {
            await questdbClient.query(
              `ALTER TABLE '${globalWorkspaces}' DROP PARTITION WHERE ts < dateadd('d', -${globalDataRetentionWindow}, now());`
            );
          } catch (error) {
            // No partitions to drop for global workspaces table
          }
          try {
            await questdbClient.query(
              `ALTER TABLE '${globalUsage}' DROP PARTITION WHERE ts < dateadd('d', -${globalDataRetentionWindow}, now());`
            );
          } catch (error) {
            // No partitions to drop for global usage table
          }
          try {
            await questdbClient.query(
              `ALTER TABLE '${globalAppDefs}' DROP PARTITION WHERE ts < dateadd('d', -${globalDataRetentionWindow}, now());`
            );
          } catch (error) {
            // No partitions to drop for global usage table
          }
          // Check if any workspaces have been deleted
          // If so, update the isDeleted column to true
          // and drop the workspace's table
          const selectTable = await questdbClient.query(`SELECT * FROM 'GLOBAL WORKSPACE LIST';`);
          for (const row of selectTable.rows) {
            let isMatched = false;
            for (const workspace of workspaceList.body.items) {
              if (row.name === workspace.metadata?.name) {
                // Workspace still exists
                isMatched = true;
                break;
              }
            }
            if (!isMatched) {
              await questdbClient.query(
                `UPDATE 'GLOBAL WORKSPACE LIST' SET isDeleted = true WHERE name = '${row.name}';`
              );
              await questdbClient.query(`DROP TABLE IF EXISTS '${row.name}';`);
            }
          }

          // For each session matched with its metrics
          // create a table for the workspace
          for (const session of sessionList.body.items) {
            for (const podMetric of metrics.items) {
              if (podMetric.metadata?.name.includes(session.metadata?.uid)) {
                const tableName = session.spec?.workspace;
                await questdbClient.query(
                  `CREATE TABLE IF NOT EXISTS '${tableName}' (ts TIMESTAMP, cpu STRING, memory STRING) timestamp(ts) PARTITION BY DAY;`
                );

                // Check if workspace is already in Global Workspace List table
                // else, add it to the table
                const globalWorkspaceList = await questdbClient.query(
                  `SELECT * FROM 'GLOBAL WORKSPACE LIST' WHERE isDeleted = false;`
                );
                let isMatched = false;
                for (const row of globalWorkspaceList.rows) {
                  if (row.name === tableName) {
                    isMatched = true;
                    break;
                  }
                }
                if (!isMatched) {
                  await questdbClient.query(
                    `INSERT INTO 'GLOBAL WORKSPACE LIST' VALUES(now(), '${tableName}', '${session.spec?.user}', false);`
                  );
                }

                // For a workspace table, drop rows older than 'workspaceDataRetentionWindow' days
                try {
                  await questdbClient.query(
                    `ALTER TABLE '${tableName}' DROP PARTITION WHERE ts < dateadd('d', -${workspaceDataRetentionWindow}, now());`
                  );
                } catch (error) {
                  // No partition to drop
                }

                // Calculate total CPU and Memory usage
                // and insert into workspace table
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
                await questdbClient.query(`INSERT INTO '${tableName}' VALUES($1, $2, $3);`, [
                  dayjs().toISOString(),
                  totalCpuUsage + cpuUnit,
                  totalMemoryUsage + memoryUnit,
                ]);

                // Add to global CPU and memory usage for GLOBAL USAGE table
                globalCPUUsage = globalCPUUsage + totalCpuUsage;
                globalMemoryUsage = globalMemoryUsage + totalMemoryUsage;
              }
            }
          }
          // Gather global CPU and memory usage
          // and insert into GLOBAL USAGE table
          // TODO: Figure out calculation of metrics units
          await questdbClient.query(`INSERT INTO '${globalUsage}' VALUES($1, $2, $3);`, [
            dayjs().toISOString(),
            globalCPUUsage + 'n',
            globalMemoryUsage + 'Ki',
          ]);

          // Gather number of ws, CPU and memory usage for each app definition
          // and insert into GLOBAL APP DEFINITIONS table
          let sessionCountObj = getAppDefCountsAsObj(sessionList);
          let workspaceCountObj = getAppDefCountsAsObj(workspaceList);
          for (const item of appDefinitionList.body.items) {
            let appDefName = item.metadata.name;
            let sessionCount = 0;
            let workspaceCount = 0;
            if (workspaceCountObj[appDefName]) {
              workspaceCount = workspaceCountObj[appDefName].length;
            }
            if (sessionCountObj[appDefName]) {
              sessionCount = sessionCountObj[appDefName].length;
            }
            let metricsObj = getCPUConsumptionOfAnAppDefinition(appDefName, metrics, sessionList);
            await questdbClient.query(`INSERT INTO '${globalAppDefs}' VALUES($1, $2, $3, $4, $5, $6);`, [
              dayjs().toISOString(),
              appDefName,
              workspaceCount,
              sessionCount,
              metricsObj.appDefCPU,
              metricsObj.appDefMemory,
            ]);
          }

          await questdbClient.query('COMMIT');
          await questdbClient.end();
        }, 60000);
        return res.status(200).json('Started fetching metrics at 1s interval');
      } else if (req.body['stop'] === true && loggingIntervalId !== undefined) {
        clearInterval(loggingIntervalId);
        loggingIntervalId = undefined;
        globalDataRetentionWindow = 1;
        workspaceDataRetentionWindow = 1;
        console.log('Stopped logging metrics');
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
        return res.status(200).json({ status: false, globalDataRetentionWindow, workspaceDataRetentionWindow });
      } else {
        return res.status(200).json({ status: true, globalDataRetentionWindow, workspaceDataRetentionWindow });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

function getAppDefCountsAsObj(list) {
  let returnObj = {};
  list.body.items.forEach((item) => {
    item.appDefinition = item.spec.appDefinition;
    if (!returnObj[item['appDefinition']]) {
      returnObj[item['appDefinition']] = [];
    }
    returnObj[item['appDefinition']].push({ ...item.metadata, ...item.spec });
  });
  return returnObj;
}

function getCPUConsumptionOfAnAppDefinition(appDefName, metrics, sessionList) {
  let metricsObj = {
    appDefCPU: 0,
    appDefMemory: 0,
  };
  metrics.items.forEach((element) => {
    for (const session of sessionList.body.items) {
      if (element.metadata?.name.includes(session.metadata.uid) && session.appDefinition === appDefName) {
        element.containers.forEach((ctn) => {
          metricsObj.appDefCPU = metricsObj.appDefCPU + parseCPUInteger(ctn.usage.cpu);
          metricsObj.appDefMemory = metricsObj.appDefMemory + parseMemoryInteger(ctn.usage.memory);
        });
      }
    }
  });
  return metricsObj;
}

function parseCPUInteger(str) {
  if (str[str.length - 1] === 'n') {
    return parseInt(str.slice(0, -1));
  }
  return 0;
}

function parseMemoryInteger(str) {
  if (str.slice(-2) === 'Ki') {
    return parseInt(str.slice(0, -2));
  }
  return 0;
}

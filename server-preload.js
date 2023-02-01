// @ts-check
'use strict';

// This file is loaded in the server process(Node.js) before any other server - side modules are loaded.

// Here we set the global.loggingIntervalId to undefined so that it can be used in "api/admin/statistics/gatherStatistics.js" globally.
// This essentially turns that API endpoint to a single global one.
global.loggingIntervalId = undefined;
console.log('loggingIntervalId = ', global.loggingIntervalId);

// Set the global and workspace specific data retention window to 1 day.
global.globalDataRetentionWindow = 1;
global.workspaceDataRetentionWindow = 1;
console.log('globalDataRetentionWindow = ', global.globalDataRetentionWindow);
console.log('workspaceDataRetentionWindow = ', global.workspaceDataRetentionWindow);

// Create a global database client object.
const { Client } = require('pg');
const questdbClient = new Client({
  database: 'qdb',
  host: '127.0.0.1',
  password: 'quest',
  port: 8812,
  user: 'admin',
});

// Connect to the database and create initial tables.
const initDb = async () => {
  console.log('Connecting to QuestDB...');
  await questdbClient.connect();
  console.log('Connected to QuestDB!');

  const isGlobalUsageCreated = await questdbClient.query(
    `CREATE TABLE IF NOT EXISTS 'GLOBAL USAGE' (ts TIMESTAMP, cpu STRING, memory STRING) timestamp(ts) PARTITION BY DAY;`
  );
  console.log('Table GLOBAL USAGE: ', isGlobalUsageCreated.command);

  const isGlobalSessionsCreated = await questdbClient.query(
    `CREATE TABLE IF NOT EXISTS 'GLOBAL SESSIONS' (ts TIMESTAMP, number INT) timestamp(ts) PARTITION BY DAY;`
  );
  console.log('Table GLOBAL SESSIONS: ', isGlobalSessionsCreated.command);

  const isGlobalWorkspacesCreated = await questdbClient.query(
    `CREATE TABLE IF NOT EXISTS 'GLOBAL WORKSPACES' (ts TIMESTAMP, number INT) timestamp(ts) PARTITION BY DAY;`
  );
  console.log('Table GLOBAL WORKSPACES: ', isGlobalWorkspacesCreated.command);

  const isGlobalAppDefinitionsCreated = await questdbClient.query(
    `CREATE TABLE IF NOT EXISTS 'GLOBAL APP DEFINITIONS' (ts TIMESTAMP, name STRING, wscount INT, sessioncount INT, totalcpu INT, totalmemory INT) timestamp(ts) PARTITION BY DAY;`
  );
  console.log('Table GLOBAL APP DEFINITIONS: ', isGlobalAppDefinitionsCreated.command);

  const isGlobalWorkspaceListCreated = await questdbClient.query(
    `CREATE TABLE IF NOT EXISTS 'GLOBAL WORKSPACE LIST' (ts TIMESTAMP, name STRING, userId STRING, isDeleted BOOLEAN) timestamp(ts) PARTITION BY DAY;`
  );
  console.log('Table GLOBAL WORKSPACE LIST: ', isGlobalWorkspaceListCreated.command);

  await questdbClient.query('COMMIT');
  console.log('Database initialized!');

  console.log('Disconnecting from QuestDB...');
  await questdbClient.end();
  console.log('Disconnected from QuestDB!');
};
initDb();

console.log('server-preload.js loaded');

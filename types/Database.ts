export const DB_TABLE_NAMES = {
  GLOBAL_USAGE: 'GLOBAL USAGE',
  GLOBAL_SESSIONS: 'GLOBAL SESSIONS',
  GLOBAL_WORKSPACES: 'GLOBAL WORKSPACES',
  GLOBAL_WORKSPACE_LIST: 'GLOBAL WORKSPACE LIST',
  GLOBAL_APP_DEFINITIONS: 'GLOBAL APP DEFINITIONS',
} as const;

export type DB_TABLE_ROW_TYPES = {
  GLOBAL_USAGE: { cpu: string; memory: string; ts: string };
  GLOBAL_WORKSPACES: { ts: string; number: number };
  GLOBAL_SESSIONS: { ts: string; number: number };
  GLOBAL_APP_DEFINITIONS: {
    ts: string;
    name: string;
    wscount: number;
    sessioncount: number;
    totalcpu: number;
    totalmemory: number;
    averagememory: number;
    averagecpu: number;
    max_cpu: number;
    max_mem: number;
  };
};

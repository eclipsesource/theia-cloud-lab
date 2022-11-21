import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams, DataGridProps } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../components/icons/RefreshIcon';
import { ISessionCRData } from './api/sessionCRs';
import { IPodMetric } from './api/metrics';

export type ItemData = {
  sessionData: ISessionCRData;
  podMetricData: IPodMetric;
};

type Row = {
  id: string;
  creationTimestamp: string;
  name: string;
  namespace: string;
  resourceVersion: string;
  uid: string;
  appDefinition: string;
  url: string;
  user: string;
  workspace: string;
  cpuUsage: string;
  memoryUsage: string;
};

const XLCol = 250;
const MCol = 80;

const Sessions = () => {
  const [sessions, setSessions] = useState<ISessionCRData[]>([]);
  const [metrics, setMetrics] = useState<IPodMetric[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const setTableData = (sessionsData: ISessionCRData[], metrics: IPodMetric[]) => {
    const rows: Row[] = [];
    for (const session of sessionsData) {
      let isMatched = false;
      for (const podMetric of metrics) {
        if (podMetric.metadata?.labels && session.name === podMetric.metadata?.labels.app) {
          isMatched = true;
          const row: Row = {
            id: session.name,
            creationTimestamp: dayjs(session.creationTimestamp).toString(),
            name: session.name,
            namespace: session.namespace,
            resourceVersion: session.resourceVersion,
            uid: session.uid,
            appDefinition: session.appDefinition,
            url: session.url,
            user: session.user,
            workspace: session.workspace,
            cpuUsage: podMetric.containers[0].usage.cpu,
            memoryUsage: podMetric.containers[0].usage.memory,
          };
          rows.push(row);
          break;
        }
      }
      if (!isMatched) {
        const row: Row = {
          id: session.name,
          creationTimestamp: dayjs(session.creationTimestamp).toString(),
          name: session.name,
          namespace: session.namespace,
          resourceVersion: session.resourceVersion,
          uid: session.uid,
          appDefinition: session.appDefinition,
          url: session.url,
          user: session.user,
          workspace: session.workspace,
          cpuUsage: '',
          memoryUsage: '',
        };
        rows.push(row);
      }
    }
    setRows(rows);
  };

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/sessionCRs')
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        console.log('sessionsCRs[]', data);
      })
      .then(() => {
        fetch('/api/metrics')
          .then((res) => res.json())
          .then((data) => {
            console.log('PodMetric[]', data);
            setMetrics(data);
          });
      })
      .catch((error) => {
        console.log('Error occured fetching data: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (sessions && sessions.length > 0 && metrics && metrics.length > 0) {
      setTableData(sessions, metrics);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [sessions, metrics]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Session Name', width: XLCol },
    { field: 'creationTimestamp', headerName: 'Creation Timestamp', width: XLCol },
    { field: 'resourceVersion', headerName: 'Resource Version', width: 130 },
    { field: 'uid', headerName: 'UID', width: XLCol },
    { field: 'appDefinition', headerName: 'App Definition', width: 120 },
    { field: 'url', headerName: 'URL', width: XLCol },
    { field: 'user', headerName: 'User', width: XLCol },
    { field: 'workspace', headerName: 'Workspace', width: XLCol },
    /* {
      field: 'cpuUsage',
      headerName: 'CPU Usage',
      headerClassName: 'bg-red-100',
      sortable: true,
      renderCell: (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
        return (
          <button
            style={{ backgroundColor: 'red' }}
            onClick={() => console.log('basti')}
          >
            {' '}
            asd
          </button>
        );
      },
    }, */
    {
      field: 'cpuUsage',
      headerName: 'CPU Usage',
      sortable: true,
      width: 100,
    },
    {
      field: 'memoryUsage',
      headerName: 'Memory Usage',
      sortable: true,
      width: 120,
    },
  ];

  const SessionsTableHeader = () => {
    return (
      <div className='flex justify-between py-4 px-4 '>
        <span className='text-lg text-gray-600 hover:text-gray-800 hover:underline'>Sessions</span>
        <button
          onClick={fetchData}
          className={`${isFetching ? 'animate-spin' : ''}`}
        >
          <RefreshIcon />
        </button>
      </div>
    );
  };
  return (
    <>
      <DataGrid
        sx={{ height: '100%', width: '100%', borderRadius: 0 }}
        rows={rows}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        getRowClassName={() => 'text-xs'}
        loading={isLoading}
        components={{
          Toolbar: SessionsTableHeader,
        }}
        getRowHeight={() => 'auto'}
      />
    </>
  );
};

export default Sessions;

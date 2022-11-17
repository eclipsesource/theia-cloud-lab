import { PodMetric } from '@kubernetes/client-node';
import { useEffect, useState } from 'react';
import TableContainer from '../components/TableContainer';
import { SessionData } from './api/sessions';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams, DataGridProps } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../components/icons/RefreshIcon';

export type ItemData = {
  sessionData: SessionData;
  podMetricData: PodMetric;
};

type Row = {
  id: string;
  app: string;
  phase: string;
  startTime: string;
  podName: string;
  workspaceVolumeClaimName: string;
  cpuUsage: string;
  memoryUsage: string;
};

const Sessions = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [metrics, setMetrics] = useState<PodMetric[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const setTableData = (sessionsData: SessionData[], metrics: PodMetric[]) => {
    const rows: Row[] = [];
    for (const session of sessionsData) {
      let isMatched = false;
      for (const podMetric of metrics) {
        if (session.podName === podMetric.metadata.name) {
          isMatched = true;
          const row: Row = {
            id: session.app,
            app: session.app,
            phase: session?.phase ?? '',
            startTime: session?.startTime ? dayjs(session.startTime).toString() : '',
            podName: session.podName,
            workspaceVolumeClaimName: session?.workspaceVolumes?.[0]?.persistentVolumeClaim?.claimName ?? '',
            cpuUsage: podMetric.containers[0].usage.cpu,
            memoryUsage: podMetric.containers[0].usage.memory,
          };
          rows.push(row);
          break;
        }
      }
      if (!isMatched) {
        const row: Row = {
          id: session.app,
          app: session.app,
          phase: session?.phase ?? '',
          startTime: session?.startTime ? dayjs(session.startTime).toString() : '',
          podName: session.podName ?? '',
          workspaceVolumeClaimName: session?.workspaceVolumes?.[0]?.persistentVolumeClaim?.claimName ?? '',
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
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        console.log('SessionData[]', data);
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
    { field: 'app', headerName: 'Session Name', width: 250 },
    { field: 'phase', headerName: 'Status', width: 70 },
    { field: 'startTime', headerName: 'Start Time', width: 130 },
    {
      field: 'podName',
      headerName: 'Pod Name',
      width: 250,
    },
    {
      field: 'workspaceVolumeClaimName',
      headerName: 'Workspace Volume Claim Name',
      width: 250,
    },
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

import { useContext, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../../components/icons/RefreshIcon';
import { IPodMetric } from '../api/metrics';
import DeleteIcon from '../../components/icons/DeleteIcon';
import TheiaButton from '../../components/TheiaButton';
import { Modal } from '@mui/material';
import PlusIcon from '../../components/icons/PlusIcon';
import { ISessionCRData } from '../../../types/ISessionCRData';
import { KeycloakContext } from '../../context/KeycloakContext';

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
  const [rows, setRows] = useState<Row[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { keycloak } = useContext(KeycloakContext);

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

  const deleteSessions = () => {
    fetch('/api/sessions/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'DELETE',
      body: JSON.stringify({ toBeDeletedSessions: selectedRows }),
    })
      .then((res) => {
        if (res.status === 204) {
          fetchData();
        }
      })
      .catch((error) => {
        console.log('Error occurred fetching data: ', error);
      });
  };

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/sessions/cr', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
      })
      .then(() => {
        fetch('/api/metrics', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
          method: 'GET',
        })
          .then((res) => res.json())
          .then((data) => {
            setMetrics(data);
          })
          .catch((error) => {
            console.log('Error occurred fetching metrics: ', error);
          });
      })
      .catch((error) => {
        console.log('Error occurred fetching sessions: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //TODO fix this logic
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      setTableData(sessions, metrics);
    }
  }, [sessions, metrics]);

  const createNewSession = () => {
    fetch('/api/sessions/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'POST',
    })
      .then((res) => {
        if (res.status === 201) {
          fetchData();
        }
      })
      .catch((error) => {
        console.log('Error occurred fetching data: ', error);
      });
  };

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
        <div>
          <TheiaButton
            text='Create Sessions'
            icon={
              <button className='hover:animate-pulse'>
                <PlusIcon />
              </button>
            }
            className='mr-2'
            onClick={() => createNewSession()}
          />

          {sessions.length > 0 && (
            <TheiaButton
              text='Delete Sessions'
              icon={
                <button className={'hover:animate-pulse'}>
                  <DeleteIcon />
                </button>
              }
              className='mr-2'
              onClick={deleteSessions}
            />
          )}

          <TheiaButton
            text='Refresh'
            icon={
              <button className={`${isFetching ? 'animate-spin' : ''} hover:animate-pulse`}>
                <RefreshIcon />
              </button>
            }
            onClick={fetchData}
          />
        </div>
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
        loading={isFetching}
        components={{
          Toolbar: SessionsTableHeader,
        }}
        getRowHeight={() => 'auto'}
        onSelectionModelChange={(e: GridRowId[]) => setSelectedRows(e)}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-1/2 p-6	bg-slate-100 shadow'>
          <span>Create a new session</span>
        </div>
      </Modal>
    </>
  );
};

export default Sessions;

import { useContext, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId, GridRowsProp } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../../components/icons/RefreshIcon';
import DeleteIcon from '../../components/icons/DeleteIcon';
import TheiaButton from '../../components/TheiaButton';
import { CircularProgress, Modal } from '@mui/material';
import PlusIcon from '../../components/icons/PlusIcon';
import { AdminSessionCRData } from '../../../types/AdminSessionCRData';
import { Context } from '../../context/Context';
import { AdminPodMetrics } from '../../../types/AdminPodMetrics';
import { useQueries, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export type ItemData = {
  sessionData: AdminSessionCRData;
  podMetricData: AdminPodMetrics;
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
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { keycloak } = useContext(Context);

  const fetchResults = useQueries({
    queries: [
      {
        queryKey: ['admin/sessions'],
        queryFn: async (): Promise<AdminSessionCRData[]> =>
          fetch('/api/admin/sessions/cr', {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'GET',
          }).then((res) => res.json()),
        initialData: [],
        retry: false,
      },
      {
        queryKey: ['admin/metrics'],
        queryFn: async (): Promise<AdminPodMetrics[]> =>
          fetch('/api/admin/metrics', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'GET',
          }).then((res) => res.json()),
        initialData: [],
        retry: false,
      },
    ],
  });

  const deleteSessionResult = useQuery({
    queryKey: ['admin/deleteSession'],
    queryFn: () =>
      fetch('/api/admin/sessions/cr', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'DELETE',
        body: JSON.stringify({ toBeDeletedSessions: selectedRows }),
      }),
    enabled: false,
    onSettled() {
      fetchResults[0].refetch();
      fetchResults[1].refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  const createSessionResult = useQuery({
    queryKey: ['admin/createSession'],
    queryFn: () =>
      fetch('/api/admin/sessions/cr', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'POST',
      }),
    enabled: false,
    onSettled() {
      fetchResults[0].refetch();
      fetchResults[1].refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

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

  const setTableData = (): Row[] => {
    if (fetchResults[0].data && fetchResults[0].data.length > 0) {
      const rows: Row[] = [];
      const arr: AdminPodMetrics[] = [];
      for (const session of fetchResults[0].data) {
        let isMatched = false;
        //TODO fix [] with results[1] array when metrics endpoint works, and remove arr
        for (const podMetric of arr) {
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
      return rows;
    }
    return [];
  };

  const getModalComponent = () => {
    return (
      <>
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

  const SessionsTableHeader = () => {
    return (
      <div className='flex py-4 px-5 shadow-sm h-20 items-center justify-between'>
        <span className='text-xl text-gray-600'>Sessions</span>
        <div>
          <TheiaButton
            text='Create Session'
            icon={<PlusIcon />}
            className='mr-2'
            onClick={() => createSessionResult.refetch()}
            disabled={
              fetchResults[0].isFetching ||
              fetchResults[1].isFetching ||
              createSessionResult.isFetching ||
              deleteSessionResult.isFetching
            }
          />

          {fetchResults[0].data && fetchResults[0].data?.length > 0 && (
            <TheiaButton
              text='Delete Sessions'
              icon={<DeleteIcon />}
              className='mr-2 bg-red-500 hover:bg-red-700'
              onClick={() => deleteSessionResult.refetch()}
              disabled={
                fetchResults[0].isFetching ||
                fetchResults[1].isFetching ||
                createSessionResult.isFetching ||
                deleteSessionResult.isFetching
              }
            />
          )}

          <TheiaButton
            className='w-32'
            text={
              fetchResults[0].isFetching ||
              fetchResults[1].isFetching ||
              createSessionResult.isFetching ||
              deleteSessionResult.isFetching
                ? ''
                : 'Refresh'
            }
            icon={
              <RefreshIcon
                className={`w-6 h-6 ${
                  (fetchResults[0].isFetching ||
                    fetchResults[1].isFetching ||
                    createSessionResult.isFetching ||
                    deleteSessionResult.isFetching) &&
                  'animate-spin'
                }`}
              />
            }
            onClick={() => {
              fetchResults[0].refetch();
              fetchResults[1].refetch();
            }}
            disabled={
              fetchResults[0].isFetching ||
              fetchResults[1].isFetching ||
              createSessionResult.isFetching ||
              deleteSessionResult.isFetching
            }
          />
        </div>
      </div>
    );
  };
  return (
    <>
      <DataGrid
        sx={{ height: '100%', width: '100%', borderRadius: 0 }}
        rows={setTableData()}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        getRowClassName={() => 'text-xs'}
        loading={fetchResults[0].isFetching || createSessionResult.isFetching || deleteSessionResult.isFetching}
        components={{
          Toolbar: SessionsTableHeader,
        }}
        getRowHeight={() => 'auto'}
        onSelectionModelChange={(e: GridRowId[]) => setSelectedRows(e)}
      />

      {getModalComponent()}
    </>
  );
};

export default Sessions;

import { useContext, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../../components/icons/RefreshIcon';
import DeleteIcon from '../../components/icons/DeleteIcon';
import TheiaButton from '../../components/TheiaButton';
import PlusIcon from '../../components/icons/PlusIcon';
import { AdminSessionCRData } from '../../../types/AdminSessionCRData';
import { Context } from '../../context/Context';
import { AdminPodMetrics } from '../../../types/AdminPodMetrics';
import { useQueries, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AdminCreateSessionModalContent from '../../components/TheiaModalContents/AdminCreateSessionModalContent';
import AdminDeleteSessionModalContent from '../../components/TheiaModalContents/AdminDeleteSessionModalContent';
import NewTabIcon from '../../components/icons/NewTabIcon';

export type ItemData = {
  sessionData: AdminSessionCRData;
  podMetricData: AdminPodMetrics;
};

export type SessionRow = {
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
  const [selectedRows, setSelectedRows] = useState<SessionRow[]>([]);
  const { keycloak, setModalContent, setIsModalOpen, adminCreateSessionIsFetching } = useContext(Context);

  const fetchResults = useQueries({
    queries: [
      {
        queryKey: ['admin/sessions'],
        queryFn: async (): Promise<AdminSessionCRData[]> =>
          fetch('/api/admin/sessions', {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'GET',
          }).then((res) => {
            if (!res.ok) {
              toast.error('There was an error fetching sessions. Please try again later.');
            }
            return res.json();
          }),
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
          }).then((res) => {
            if (!res.ok) {
              toast.error('There was an error fetching metrics. Please try again later.');
            }
            return res.json();
          }),
        initialData: [],
        retry: false,
      },
    ],
  });

  const deleteSessionResult = useQuery({
    queryKey: ['admin/deleteSession'],
    queryFn: () =>
      fetch('/api/admin/sessions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'DELETE',
        body: JSON.stringify({ toBeDeletedSessions: selectedRows }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error deleting sessions. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      fetchResults[0].refetch();
      fetchResults[1].refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  /* const createSessionResult = useQuery({
    queryKey: ['admin/createSession'],
    queryFn: () =>
      fetch('/api/admin/sessions/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({ userId: createSessionUserId, appDefinition: 'theia-cloud-demo' }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error creating session. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      fetchResults[0].refetch();
      fetchResults[1].refetch();
    },
    staleTime: Infinity,
    retry: false,
  }); */

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Session Name', width: XLCol },
    { field: 'creationTimestamp', headerName: 'Creation Timestamp', width: XLCol },
    { field: 'resourceVersion', headerName: 'Resource Version', width: 130 },
    { field: 'uid', headerName: 'UID', width: XLCol },
    { field: 'appDefinition', headerName: 'App Definition', width: 120 },
    {
      field: 'url',
      headerName: 'URL',
      width: XLCol,
      sortable: true,
      renderCell: (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
        console.log(params);
        return (
          <a
            href={'//' + params.value}
            target='_blank'
            className='flex text-xs cursor-pointer font-medium h-fit w-fit hover:underline text-blue-500 items-center'
            rel='noreferrer'
          >
            {params.value} <NewTabIcon className='w-5 h-5' />
          </a>
        );
      },
    },
    { field: 'user', headerName: 'User', width: XLCol },
    { field: 'workspace', headerName: 'Workspace', width: XLCol },
    /* {
      field: 'url',
      headerName: 'URL',
      width: XLCol
      headerClassName: 'bg-red-100',
      sortable: true,
      renderCell: (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
        return (
          <a
            href={'//' + props.userSessionCRData.url + '/'}
            target='_blank'
            className='flex text-lg cursor-pointer font-medium h-fit w-fit hover:underline text-blue-500 items-center'
            rel='noreferrer'
          >
            {props.userWorkspaceCRData.name} <NewTabIcon className='w-5 h-5' />
          </a>
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

  const setTableData = (): SessionRow[] => {
    if (fetchResults[0].data && fetchResults[0].data.length > 0) {
      const rows: SessionRow[] = [];
      const arr: AdminPodMetrics[] = [];
      for (const session of fetchResults[0].data) {
        let isMatched = false;
        //TODO fix [] with results[1] array when metrics endpoint works, and remove arr
        for (const podMetric of arr) {
          if (podMetric.metadata?.labels && session.name === podMetric.metadata?.labels.app) {
            isMatched = true;
            const row: SessionRow = {
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
          const row: SessionRow = {
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

  const SessionsTableHeader = () => {
    return (
      <div className='flex py-4 px-5 shadow-sm h-20 items-center justify-between'>
        <span className='text-xl text-gray-600'>Sessions</span>
        <span className='flex gap-2 flex-wrap justify-end'>
          <TheiaButton
            text='Create Session'
            icon={<PlusIcon />}
            onClick={() => {
              setModalContent({
                function: AdminCreateSessionModalContent,
                props: {
                  refresh: () => {
                    fetchResults[0].refetch();
                    fetchResults[1].refetch();
                  },
                  setIsModalOpen,
                  keycloak,
                },
              });
              setIsModalOpen(true);
            }}
            disabled={
              fetchResults[0].isFetching ||
              fetchResults[1].isFetching ||
              adminCreateSessionIsFetching ||
              deleteSessionResult.isFetching
            }
          />
          <TheiaButton
            text='Delete Sessions'
            icon={<DeleteIcon />}
            className='bg-red-500 hover:bg-red-700 disabled:bg-red-300'
            onClick={() => {
              setModalContent({
                function: AdminDeleteSessionModalContent,
                props: {
                  refetch: deleteSessionResult.refetch,
                  setIsModalOpen,
                  selectedRows,
                },
              });
              setIsModalOpen(true);
            }}
            disabled={
              fetchResults[0].isFetching ||
              fetchResults[1].isFetching ||
              adminCreateSessionIsFetching ||
              deleteSessionResult.isFetching ||
              selectedRows.length < 1
            }
          />
          <TheiaButton
            className='lg:w-32'
            text={
              fetchResults[0].isFetching ||
              fetchResults[1].isFetching ||
              adminCreateSessionIsFetching ||
              deleteSessionResult.isFetching
                ? ''
                : 'Refresh'
            }
            icon={
              <RefreshIcon
                className={`w-6 h-6 ${
                  (fetchResults[0].isFetching ||
                    fetchResults[1].isFetching ||
                    adminCreateSessionIsFetching ||
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
              adminCreateSessionIsFetching ||
              deleteSessionResult.isFetching
            }
          />
        </span>
      </div>
    );
  };
  return (
    <DataGrid
      sx={{ height: '100%', width: '100%', borderRadius: 0 }}
      rows={setTableData()}
      columns={columns}
      checkboxSelection
      disableSelectionOnClick
      experimentalFeatures={{ newEditingApi: true }}
      getRowClassName={() => 'text-xs'}
      loading={fetchResults[0].isFetching || adminCreateSessionIsFetching || deleteSessionResult.isFetching}
      components={{
        Toolbar: SessionsTableHeader,
      }}
      getRowHeight={() => 'auto'}
      onSelectionModelChange={(ids) => {
        const selectedIDs = new Set(ids);
        const selectedRowData = setTableData().filter((row) => selectedIDs.has(row.id.toString()));
        setSelectedRows(selectedRowData);
      }}
    />
  );
};

export default Sessions;

import { useContext, useState } from 'react';
import TheiaButton from '../../components/TheiaButton';
import DeleteIcon from '../../components/icons/DeleteIcon';
import RestartIcon from '../../components/icons/RestartIcon';
import { GridRowId, DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../../components/icons/RefreshIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import { AdminWorkspaceCRData } from '../../../types/AdminWorkspaceCRData';
import { Context } from '../../context/Context';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ExclamationIcon from '../../components/icons/ExclamationIcon';
import CancelIcon from '../../components/icons/CancelIcon';

type Row = AdminWorkspaceCRData & {
  id: string;
};

const XLCol = 250;

const Workspaces = () => {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const { keycloak, setModalContent, setIsModalOpen } = useContext(Context);

  const setTableData = (): Row[] => {
    if (fetchWorkspacesResult.data && fetchWorkspacesResult.data.length > 0) {
      const rows: Row[] = [];
      for (const workspace of fetchWorkspacesResult.data) {
        const row: Row = {
          id: workspace.name,
          name: workspace.name,
          creationTimestamp: dayjs(workspace.creationTimestamp).toString(),
          uid: workspace.uid,
          appDefinition: workspace.appDefinition,
          label: workspace.label,
          storage: workspace.storage,
          user: workspace.user,
        };
        rows.push(row);
      }
      return rows;
    }
    return [];
  };

  const deleteWorkspacesResult = useQuery({
    queryKey: ['admin/deleteWorkspaces'],
    queryFn: () =>
      fetch('/api/admin/workspaces/cr', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'DELETE',
        body: JSON.stringify({ toBeDeletedWorkspaces: selectedRows }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error deleting workspaces. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      fetchWorkspacesResult.refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  const restartWorkspacesResult = useQuery({
    queryKey: ['admin/restartWorkspaces'],
    queryFn: () =>
      fetch('/api/admin/workspaces/session', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({ toBeRestartedSessions: selectedRows }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error starting workspaces. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      fetchWorkspacesResult.refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  const createWorkspacesResult = useQuery({
    queryKey: ['admin/createWorkspaces'],
    queryFn: () =>
      fetch('/api/admin/workspaces/cr', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({ toBeCreatedWorkspace: `${Date.now()}` }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error creating workspaces. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      fetchWorkspacesResult.refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  const fetchWorkspacesResult = useQuery({
    queryKey: ['admin/fetchWorkspaces'],
    queryFn: async (): Promise<AdminWorkspaceCRData[]> =>
      fetch('/api/admin/workspaces/cr', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error fetching workspaces. Please try again later.');
        }
        return res.json();
      }),
    initialData: [],
    retry: false,
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Workspace Name', width: XLCol },
    { field: 'creationTimestamp', headerName: 'Creation Timestamp', width: 220 },
    { field: 'user', headerName: 'User', width: 200 },
    { field: 'appDefinition', headerName: 'App Definition', width: 120 },
    { field: 'label', headerName: 'Label', width: XLCol },
    { field: 'storage', headerName: 'Storage', width: XLCol },
    { field: 'uid', headerName: 'UID', width: XLCol },
  ];

  const WorkspacesTableHeader = () => {
    return (
      <div className='flex py-4 px-5 shadow-sm h-20 items-center justify-between'>
        <span className='text-xl text-gray-600'>Workspaces</span>
        <div>
          <TheiaButton
            text='Create Workspace'
            icon={<PlusIcon />}
            className='mr-2'
            onClick={() => createWorkspacesResult.refetch()}
            disabled={
              deleteWorkspacesResult.isFetching ||
              createWorkspacesResult.isFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching
            }
          />
          <TheiaButton
            text='Delete Workspaces'
            icon={<DeleteIcon />}
            className='mr-2 bg-red-500 hover:bg-red-700 disabled:bg-red-300'
            onClick={() => {
              setModalContent(
                <div className='w-full h-full flex flex-col gap-5 items-center'>
                  <ExclamationIcon className='w-16 h-16' />
                  <div className='w-full font-normal'>
                    You are trying to delete {selectedRows.length} workspace{selectedRows.length > 1 && 's'}. This
                    action cannot be undone. Are you sure?
                  </div>
                  <div className='flex justify-between w-full'>
                    <TheiaButton
                      text='Cancel'
                      icon={<CancelIcon />}
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                    />
                    <TheiaButton
                      className='bg-red-500 hover:bg-red-700'
                      text='Delete Workspace'
                      icon={<DeleteIcon className='w-6 h-6 stroke-white' />}
                      onClick={() => {
                        deleteWorkspacesResult.refetch();
                        setIsModalOpen(false);
                      }}
                    />
                  </div>
                </div>
              );
              setIsModalOpen(true);
            }}
            disabled={
              deleteWorkspacesResult.isFetching ||
              createWorkspacesResult.isFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching ||
              selectedRows.length < 1
            }
          />
          <TheiaButton
            text='Start Sessions'
            icon={<RestartIcon />}
            className='mr-2'
            onClick={() => restartWorkspacesResult.refetch()}
            disabled={
              deleteWorkspacesResult.isFetching ||
              createWorkspacesResult.isFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching ||
              selectedRows.length < 1
            }
          />
          <TheiaButton
            className='w-32'
            text={
              deleteWorkspacesResult.isFetching ||
              createWorkspacesResult.isFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching
                ? ''
                : 'Refresh'
            }
            icon={
              <RefreshIcon
                className={`w-6 h-6 ${
                  (deleteWorkspacesResult.isFetching ||
                    createWorkspacesResult.isFetching ||
                    restartWorkspacesResult.isFetching ||
                    fetchWorkspacesResult.isFetching) &&
                  'animate-spin'
                }`}
              />
            }
            onClick={() => fetchWorkspacesResult.refetch()}
            disabled={
              deleteWorkspacesResult.isFetching ||
              createWorkspacesResult.isFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching
            }
          />
        </div>
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
      loading={fetchWorkspacesResult.isFetching}
      components={{
        Toolbar: WorkspacesTableHeader,
      }}
      getRowHeight={() => 'auto'}
      onSelectionModelChange={(e: GridRowId[]) => setSelectedRows(e)}
    />
  );
};

export default Workspaces;

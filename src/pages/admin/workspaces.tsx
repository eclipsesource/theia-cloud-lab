import { useContext, useEffect, useState } from 'react';
import TheiaButton from '../../components/TheiaButton';
import DeleteIcon from '../../components/icons/DeleteIcon';
import RestartIcon from '../../components/icons/RestartIcon';
import { GridRowId, DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../../components/icons/RefreshIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import { AdminWorkspaceCRData } from '../../../types/AdminWorkspaceCRData';
import { KeycloakContext } from '../../context/KeycloakContext';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type Row = AdminWorkspaceCRData & {
  id: string;
};

const XLCol = 250;

const Workspaces = () => {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const { keycloak } = useContext(KeycloakContext);

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

  const deleteWorkspaces = () => {
    return fetch('/api/admin/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'DELETE',
      body: JSON.stringify({ toBeDeletedWorkspaces: selectedRows }),
    });
  };

  const deleteWorkspacesResult = useQuery({
    queryKey: ['admin/deleteWorkspaces'],
    queryFn: deleteWorkspaces,
    enabled: false,
    onSettled() {
      fetchWorkspacesResult.refetch();
    },
    staleTime: Infinity,
    onError() {
      toast.error('There was an error deleting a workspace. Please try again later.');
    },
    retry: false,
  });

  const restartWorkspaces = () => {
    return fetch('/api/admin/workspaces/session', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'POST',
      body: JSON.stringify({ toBeRestartedSessions: selectedRows }),
    });
  };

  const restartWorkspacesResult = useQuery({
    queryKey: ['admin/restartWorkspaces'],
    queryFn: restartWorkspaces,
    enabled: false,
    onSettled() {
      fetchWorkspacesResult.refetch();
    },
    staleTime: Infinity,
    onError() {
      toast.error('There was an error restaring a workspace. Please try again later.');
    },
    retry: false,
  });

  const createNewWorkplace = () => {
    return fetch('/api/admin/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'POST',
      body: JSON.stringify({ toBeCreatedWorkspace: `${Date.now()}` }),
    });
  };

  const createWorkspacesResult = useQuery({
    queryKey: ['admin/createWorkspaces'],
    queryFn: createNewWorkplace,
    enabled: false,
    onSettled() {
      fetchWorkspacesResult.refetch();
    },
    staleTime: Infinity,
    onError() {
      toast.error('There was an error creating a workspace. Please try again later.');
    },
    retry: false,
  });

  const fetchWorkspaces = async (): Promise<AdminWorkspaceCRData[]> => {
    return fetch('/api/admin/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    }).then((res) => res.json());
  };
  const fetchWorkspacesResult = useQuery({
    queryKey: ['admin/fetchWorkspaces'],
    queryFn: fetchWorkspaces,
    initialData: undefined,
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

  const isFetching =
    deleteWorkspacesResult.isFetching ||
    createWorkspacesResult.isFetching ||
    restartWorkspacesResult.isFetching ||
    fetchWorkspacesResult.isFetching;

  const WorkspacesTableHeader = () => {
    return (
      <div className='flex justify-between py-4 px-4 '>
        <span className='text-lg font-extralight text-gray-600 hover:text-gray-800'>Workspaces</span>
        <div>
          <TheiaButton
            text='Create Workspace'
            icon={
              <button className='hover:animate-pulse'>
                <PlusIcon />
              </button>
            }
            className='mr-2'
            onClick={() => createWorkspacesResult.refetch()}
          />

          {fetchWorkspacesResult.data && fetchWorkspacesResult.data?.length > 0 && (
            <TheiaButton
              text='Delete Workspaces'
              icon={<DeleteIcon />}
              className='mr-2'
              onClick={() => deleteWorkspacesResult.refetch()}
            />
          )}

          {fetchWorkspacesResult.data && fetchWorkspacesResult.data?.length > 0 && (
            <TheiaButton
              text='Restart Sessions'
              icon={
                <button className={`${isFetching ? 'animate-bounce' : ''}`}>
                  <RestartIcon />
                </button>
              }
              className='mr-2'
              onClick={() => restartWorkspacesResult.refetch()}
            />
          )}

          <TheiaButton
            text='Refresh'
            icon={
              <button className={`${isFetching ? 'animate-spin' : ''} hover:animate-pulse`}>
                <RefreshIcon />
              </button>
            }
            onClick={() => fetchWorkspacesResult.refetch()}
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
        loading={isFetching}
        components={{
          Toolbar: WorkspacesTableHeader,
        }}
        getRowHeight={() => 'auto'}
        onSelectionModelChange={(e: GridRowId[]) => setSelectedRows(e)}
      />
    </>
  );
};

export default Workspaces;

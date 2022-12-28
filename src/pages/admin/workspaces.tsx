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
import AdminDeleteWorkspaceModalContent from '../../components/TheiaModalContents/AdminDeleteWorkspaceModalContent';
import AdminCreateWorkspaceModalContent from '../../components/TheiaModalContents/AdminCreateWorkspaceModalContent';

export type WorkspaceRow = AdminWorkspaceCRData & {
  id: string;
};

const XLCol = 250;

const Workspaces = () => {
  const [selectedRows, setSelectedRows] = useState<WorkspaceRow[]>([]);
  const { keycloak, setModalContent, setIsModalOpen, adminCreateWorkspaceIsFetching } = useContext(Context);

  const setTableData = (): WorkspaceRow[] => {
    if (fetchWorkspacesResult.data && fetchWorkspacesResult.data.length > 0) {
      const rows: WorkspaceRow[] = [];
      for (const workspace of fetchWorkspacesResult.data) {
        const row: WorkspaceRow = {
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
        body: JSON.stringify({ toBeStartedSessions: selectedRows }),
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
        <span className='flex gap-2 flex-wrap justify-end'>
          <TheiaButton
            text='Create Workspace'
            icon={<PlusIcon />}
            onClick={() => {
              setModalContent({
                function: AdminCreateWorkspaceModalContent,
                props: {
                  refresh: () => {
                    fetchWorkspacesResult.refetch();
                  },
                  setIsModalOpen,
                  keycloak,
                },
              });
              setIsModalOpen(true);
            }}
            disabled={
              deleteWorkspacesResult.isFetching ||
              adminCreateWorkspaceIsFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching
            }
          />
          <TheiaButton
            text='Delete Workspaces'
            icon={<DeleteIcon />}
            className='bg-red-500 hover:bg-red-700 disabled:bg-red-300'
            onClick={() => {
              setModalContent({
                function: AdminDeleteWorkspaceModalContent,
                props: {
                  refetch: deleteWorkspacesResult.refetch,
                  setIsModalOpen,
                  selectedRows,
                },
              });
              setIsModalOpen(true);
            }}
            disabled={
              deleteWorkspacesResult.isFetching ||
              adminCreateWorkspaceIsFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching ||
              selectedRows.length < 1
            }
          />
          <TheiaButton
            text='Start Sessions'
            icon={<RestartIcon />}
            onClick={() => restartWorkspacesResult.refetch()}
            disabled={
              deleteWorkspacesResult.isFetching ||
              adminCreateWorkspaceIsFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching ||
              selectedRows.length < 1
            }
          />
          <TheiaButton
            className='lg:w-32'
            text={
              deleteWorkspacesResult.isFetching ||
              adminCreateWorkspaceIsFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching
                ? ''
                : 'Refresh'
            }
            icon={
              <RefreshIcon
                className={`w-6 h-6 ${
                  (deleteWorkspacesResult.isFetching ||
                    adminCreateWorkspaceIsFetching ||
                    restartWorkspacesResult.isFetching ||
                    fetchWorkspacesResult.isFetching) &&
                  'animate-spin'
                }`}
              />
            }
            onClick={() => fetchWorkspacesResult.refetch()}
            disabled={
              deleteWorkspacesResult.isFetching ||
              adminCreateWorkspaceIsFetching ||
              restartWorkspacesResult.isFetching ||
              fetchWorkspacesResult.isFetching
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
      loading={fetchWorkspacesResult.isFetching && fetchWorkspacesResult.data.length === 0}
      components={{
        Toolbar: WorkspacesTableHeader,
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

export default Workspaces;

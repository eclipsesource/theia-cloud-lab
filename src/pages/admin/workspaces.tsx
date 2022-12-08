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

type Row = AdminWorkspaceCRData & {
  id: string;
};

const XLCol = 250;
const MCol = 80;

const Workspaces = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [workspaces, setWorkspaces] = useState<AdminWorkspaceCRData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const { keycloak } = useContext(KeycloakContext);

  const setTableData = (workspaces: AdminWorkspaceCRData[]) => {
    const rows: Row[] = [];
    for (const workspace of workspaces) {
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
    setRows(rows);
  };

  const deleteWorkspaces = () => {
    fetch('/api/admin/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'DELETE',
      body: JSON.stringify({ toBeDeletedWorkspaces: selectedRows }),
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

  const restartWorkspaces = () => {
    fetch('/api/admin/workspaces/session', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'POST',
      body: JSON.stringify({ toBeRestartedSessions: selectedRows }),
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

  const createNewWorkplace = () => {
    fetch('/api/admin/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'POST',
      body: JSON.stringify({ toBeCreatedWorkspace: `${Date.now()}` }),
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

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/admin/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkspaces(data);
      })
      .catch((error) => {
        console.log('Error occurred fetching data: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (workspaces) {
      setTableData(workspaces);
    }
  }, [workspaces]);

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
      <div className='flex justify-between py-4 px-4 '>
        <span className='text-lg text-gray-600 hover:text-gray-800 hover:underline'>Workspaces</span>
        <div>
          <TheiaButton
            text='Create Workspace'
            icon={
              <button className='hover:animate-pulse'>
                <PlusIcon />
              </button>
            }
            className='mr-2'
            onClick={() => createNewWorkplace()}
          />

          {workspaces.length > 0 && (
            <TheiaButton
              text='Delete Workspaces'
              icon={
                <button className='hover:animate-pulse'>
                  <DeleteIcon />
                </button>
              }
              className='mr-2'
              onClick={deleteWorkspaces}
            />
          )}

          {workspaces.length > 0 && (
            <TheiaButton
              text='Restart Sessions'
              icon={
                <button className={`${isFetching ? 'animate-bounce' : ''} hover:animate-pulse`}>
                  <RestartIcon />
                </button>
              }
              className='mr-2'
              onClick={restartWorkspaces}
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
          Toolbar: WorkspacesTableHeader,
        }}
        getRowHeight={() => 'auto'}
        onSelectionModelChange={(e: GridRowId[]) => setSelectedRows(e)}
      />
    </>
  );
};

export default Workspaces;

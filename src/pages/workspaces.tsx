import { useContext, useEffect, useState } from 'react';
import TheiaButton from '../components/TheiaButton';
import DeleteIcon from '../components/icons/DeleteIcon';
import { GridRowId, DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../components/icons/RefreshIcon';
import PlusIcon from '../components/icons/PlusIcon';
import { WorkspaceCRData } from './api/workspaces/cr';
import { LoginContext } from '../context/LoginContext';

type Row = WorkspaceCRData & {
  id: string;
};

const XLCol = 250;
const MCol = 80;

const Workspaces = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceCRData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const { token } = useContext(LoginContext);

  const setTableData = (workspaces: WorkspaceCRData[]) => {
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
    setIsDeleting(true);
    console.log('here', selectedRows);
    fetch('/api/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
      body: JSON.stringify({ toBeDeletedWorkspaces: selectedRows }),
    })
      .then((res) => {
        if (res.status === 204) {
          fetchData();
          setIsDeleted(true);
        }
      })
      .catch((error) => {
        console.log('Error occured fetching data: ', error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const createNewWorkplace = () => {
    setIsFetching(true);
    fetch('/api/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
        console.log('Error occured fetching data: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/workspaces/cr', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkspaces(data);
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
    if (workspaces && workspaces.length > 0) {
      setTableData(workspaces);
      setIsLoading(false);
    } else if (isDeleted) {
      setTableData(workspaces);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [workspaces, isDeleted]);

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
        <span className='text-lg text-gray-600 hover:text-gray-800 hover:underline'>Workplaces</span>
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
                <button className={`${isDeleting ? 'animate-bounce' : ''} hover:animate-pulse`}>
                  <DeleteIcon />
                </button>
              }
              className='mr-2'
              onClick={deleteWorkspaces}
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
        loading={isLoading}
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

import { PodMetric } from '@kubernetes/client-node';
import { useEffect, useState } from 'react';
import TableContainer from '../components/TableContainer';
import { SessionData } from './api/sessions';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams, DataGridProps } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../components/icons/RefreshIcon';
import { WorkspaceCRData } from './api/workspaceCRs';

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

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/workspaceCRs')
      .then((res) => res.json())
      .then((data) => {
        setWorkspaces(data);
        console.log('workspaceCRs', data);
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
    } else {
      setIsLoading(true);
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

  const SessionsTableHeader = () => {
    return (
      <div className='flex justify-between py-4 px-4 '>
        <span className='text-lg text-gray-600 hover:text-gray-800 hover:underline'>Workspaces</span>
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

export default Workspaces;

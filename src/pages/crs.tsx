import { PodMetric } from '@kubernetes/client-node';
import { useEffect, useState } from 'react';
import TableContainer from '../components/TableContainer';
import { SessionData } from './api/sessions';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams, DataGridProps } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import RefreshIcon from '../components/icons/RefreshIcon';

const Sessions = () => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/sessionCRs')
      .then((res) => res.json())
      .then((data) => {
        console.log('crs', data);
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

  return <div>hi</div>;
};

export default Sessions;

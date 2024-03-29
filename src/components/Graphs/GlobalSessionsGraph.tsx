import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { DB_TABLE_NAMES, DB_TABLE_ROW_TYPES } from '../../../types/Database';
import { useQuery } from '@tanstack/react-query';
import { memo, useContext } from 'react';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';

dayjs.extend(localizedFormat);

const GlobalSessionsGraph = () => {
  const { keycloak } = useContext(Context);
  // Registering the chart.js plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const queryGlobalSessionsTable = useQuery({
    queryKey: ['admin/statistics/global/sessions'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_SESSIONS'][]> =>
      fetch('/api/admin/statistics/getTableData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ tableName: DB_TABLE_NAMES.GLOBAL_SESSIONS, isPerUser: false }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error getting global sessions statistics. Please try again later.');
        }
        return res.json();
      }),
    initialData: [],
    retry: false,
    refetchInterval: 60000,
  });

  return (
    <Line
      datasetIdKey='global-sessions-table'
      data={{
        labels: queryGlobalSessionsTable.data.map((row) => dayjs(row.ts).format('lll')),
        datasets: [
          {
            label: 'Number of Sessions',
            borderColor: 'rgb(75, 192, 192)',
            data: queryGlobalSessionsTable.data.map((row, i) => {
              if (i === 0) {
                return row.number;
              } else if (i === queryGlobalSessionsTable.data.length - 1) {
                return row.number;
              } else if (queryGlobalSessionsTable.data[i + 1].number !== row.number) {
                return row.number;
              } else if (queryGlobalSessionsTable.data[i - 1].number === row.number) {
                return null;
              } else {
                return row.number;
              }
            }),
            tension: 0,
            spanGaps: true,
          },
        ],
      }}
    />
  );
};

export default memo(GlobalSessionsGraph);

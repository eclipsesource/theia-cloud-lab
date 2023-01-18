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
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { memo, useContext } from 'react';
import { Context } from '../../context/Context';

dayjs.extend(localizedFormat);

const GlobalResourceUsageGraph = () => {
  const { keycloak } = useContext(Context);
  // Registering the chart.js plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const queryGlobalUsageTable = useQuery({
    queryKey: ['admin/statistics/global/usage'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_USAGE'][]> =>
      fetch('/api/admin/statistics/getTableData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ tableName: DB_TABLE_NAMES.GLOBAL_USAGE }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error getting global usage statistics. Please try again later.');
        }
        return res.json();
      }),
    initialData: [],
    retry: false,
    refetchInterval: 60000,
  });

  return (
    <>
      {' '}
      <Line
        datasetIdKey='global-cpu-usage-table'
        data={{
          labels: queryGlobalUsageTable.data.map((row) => dayjs(row.ts).format('lll')),
          datasets: [
            {
              label: 'CPU Usage (CPU)',
              data: queryGlobalUsageTable.data.map((row) => {
                const match = row.cpu.match(/(\d*)(\D*)/);
                if (match) {
                  return Number(match[1]) * 0.000000001;
                }
              }),
              tension: 0.4,
              fill: false,
              borderColor: 'rgb(0, 0, 255)',
            },
          ],
        }}
      />
      <Line
        datasetIdKey='global-memory-usage-table'
        data={{
          labels: queryGlobalUsageTable.data.map((row) => dayjs(row.ts).format('lll')),
          datasets: [
            {
              label: 'Memory Usage (MB)',
              data: queryGlobalUsageTable.data.map((row) => {
                const match = row.memory.match(/(\d*)(\D*)/);
                if (match) {
                  return Number(match[1]) * 0.001024;
                }
              }),
              tension: 0.4,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
            },
          ],
        }}
      />
    </>
  );
};

export default memo(GlobalResourceUsageGraph);

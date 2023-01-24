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
import { isNonNullChain } from 'typescript';

dayjs.extend(localizedFormat);

const GlobalAppDefUsageGraph = () => {
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
      <Line
        datasetIdKey='global-cpu-usage-table'
        data={{
          labels: queryGlobalUsageTable.data.map((row) => dayjs(row.ts).format('lll')),
          datasets: [
            {
              label: 'Top 10 Usage',
              borderColor: 'rgb(0, 0, 255)',
              data: queryGlobalUsageTable.data.map((row, i) => {
                let currentValue;
                let nextValue;
                let lastValue;

                const currentValueMatch :any = row.cpu.match(/(\d*)(\D*)/);
                if (currentValueMatch) {
                  currentValue = (Number(currentValueMatch[1]) * 0.000000001).toFixed(3);
                }
                if (i === 0) {
                  return currentValue;
                } else if (i === queryGlobalUsageTable.data.length - 1) {
                  return currentValue;
                }

                const nextValueMatch :any = queryGlobalUsageTable.data[i + 1].cpu.match(/(\d*)(\D*)/);
                if (nextValueMatch) {
                  nextValue = (Number(nextValueMatch[1]) * 0.000000001).toFixed(3);
                }

                const lastValueMatch = queryGlobalUsageTable.data[i - 1].cpu.match(/(\d*)(\D*)/);
                if (lastValueMatch) {
                  lastValue = (Number(lastValueMatch[1]) * 0.000000001).toFixed(3);
                }

                if (nextValue !== currentValue) {
                  return currentValue;
                } else if (lastValue === currentValue) {
                  return null;
                } else {
                  return currentValue;
                }
              }),
              tension: 0,
              spanGaps: true,
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
              label: 'Frequency of Usage',
              borderColor: 'rgb(75, 192, 192)',
              data: queryGlobalUsageTable.data.map((row, i) => {
                let currentValue;
                let nextValue;
                let lastValue;

                const currentValueMatch = row.memory.match(/(\d*)(\D*)/);
                if (currentValueMatch) {
                  currentValue = Math.ceil(Number(currentValueMatch[1]) * 0.001024);
                }
                if (i === 0) {
                  return currentValue;
                } else if (i === queryGlobalUsageTable.data.length - 1) {
                  return currentValue;
                }

                const nextValueMatch = queryGlobalUsageTable.data[i + 1].memory.match(/(\d*)(\D*)/);
                if (nextValueMatch) {
                  nextValue = Math.ceil(Number(nextValueMatch[1]) * 0.001024);
                }

                const lastValueMatch = queryGlobalUsageTable.data[i - 1].memory.match(/(\d*)(\D*)/);
                if (lastValueMatch) {
                  lastValue = Math.ceil(Number(lastValueMatch[1]) * 0.001024);
                }

                if (nextValue !== currentValue) {
                  return currentValue;
                } else if (lastValue === currentValue) {
                  return null;
                } else {
                  return currentValue;
                }
              }),
              tension: 0,
              spanGaps: true,
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
              label: 'Average Usage',
              borderColor: 'rgb(75, 192, 192)',
              data: queryGlobalUsageTable.data.map((row, i) => {
                let currentValue;
                let nextValue;
                let lastValue;

                const currentValueMatch = row.memory.match(/(\d*)(\D*)/);
                if (currentValueMatch) {
                  currentValue = Math.ceil(Number(currentValueMatch[1]) * 0.001024);
                }
                if (i === 0) {
                  return currentValue;
                } else if (i === queryGlobalUsageTable.data.length - 1) {
                  return currentValue;
                }

                const nextValueMatch = queryGlobalUsageTable.data[i + 1].memory.match(/(\d*)(\D*)/);
                if (nextValueMatch) {
                  nextValue = Math.ceil(Number(nextValueMatch[1]) * 0.001024);
                }

                const lastValueMatch = queryGlobalUsageTable.data[i - 1].memory.match(/(\d*)(\D*)/);
                if (lastValueMatch) {
                  lastValue = Math.ceil(Number(lastValueMatch[1]) * 0.001024);
                }

                if (nextValue !== currentValue) {
                  return currentValue;
                } else if (lastValue === currentValue) {
                  return null;
                } else {
                  return currentValue;
                }
              }),
              tension: 0,
              spanGaps: true,
            },
          ],
        }}
      />
    </>
  );
};

export default memo(GlobalAppDefUsageGraph);

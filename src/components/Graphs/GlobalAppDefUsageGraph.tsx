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

  const queryTopTenAppDefsWithMostConsumption = useQuery({
    queryKey: ['admin/statistics/appdefs/topTenAppDefs'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_APP_DEFINITIONS'][]> =>
      fetch('/api/admin/statistics/getAppDefinitionsData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ graphInfo: 'topTenAppDefs' }),
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
  const queryTopTenAppDefsWithMostPopular = useQuery({
    queryKey: ['admin/statistics/appdefs/mostPopularAppDefs'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_APP_DEFINITIONS'][]> =>
      fetch('/api/admin/statistics/getAppDefinitionsData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ graphInfo: 'mostPopularAppDefs' }),
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
  const queryTopTenAppDefsWithAverageConsumption = useQuery({
    queryKey: ['admin/statistics/appdefs/averageConsumption'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_APP_DEFINITIONS'][]> =>
      fetch('/api/admin/statistics/getAppDefinitionsData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ graphInfo: 'averageConsumption' }),
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
          labels: queryTopTenAppDefsWithMostConsumption.data.map((row) => row.name),
          datasets: [
            {
              label: 'Top 10 App Definitions with Most Resource Consumption',
              borderColor: 'rgb(0, 0, 255)',
              data: queryTopTenAppDefsWithMostConsumption.data.map((row, i) => {
                console.log(row);
                // THIS PARTTT
                // THIS CONFUSED ME, it is hard to show. I get top 10 app defs, i think it shouldnt be point graph it can be table like structure. Will be changed!!!
                return row;
              }),
              tension: 0,
              spanGaps: true,
            }
          ],
        }}
      />
      <Line
        datasetIdKey='global-appdefs-usage-table'
        data={{
          labels: queryTopTenAppDefsWithMostPopular.data.map((row) => dayjs(row.ts).format('lll')),
          datasets: [
            {
              label: "theia-cloud-demo", // I DONT KNOW HOW TO GIVE DYNAMIC LABELS HERE, I WANT TO UPDATE IT WITH EVERY ROWS NAME FIELD
              borderColor: 'rgb(75, 192, 192)',
              data: queryTopTenAppDefsWithMostPopular.data.map((row, i) => {
                // console.log(row);
                return row.wscount;
              }),
              tension: 0,
              spanGaps: true,
            },
          ],
        }}
      />
      <Line
        datasetIdKey='global-appdefs-usage-table'
        data={{
          labels: queryTopTenAppDefsWithAverageConsumption.data.map((row) => dayjs(row.ts).format('lll')),
          datasets: [
            {
              label: 'Average Memory Consumption of an App Definition', // I ALSO CANT TELL HERE WHICH APP DEF NAME HELPPPP
              borderColor: 'rgb(75, 192, 192)',
              data: queryTopTenAppDefsWithAverageConsumption.data.map((row, i) => {
                // console.log(row);
                return row.averagememory;
              }),
              tension: 0,
              spanGaps: true,
            },
            {
                label: 'Average CPU Consumption of an App Definition',
                borderColor: 'rgb(75, 192, 100)',
                data: queryTopTenAppDefsWithAverageConsumption.data.map((row, i) => {
                  // console.log(row);
                  return row.averagecpu;
                }),
                tension: 0,
                spanGaps: true,
              }
          ],
        }}
      />
    </>
  );
};

export default memo(GlobalAppDefUsageGraph);

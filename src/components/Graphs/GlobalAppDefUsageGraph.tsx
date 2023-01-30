import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
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
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

  const queryTopTenAppDefsWithMostCPUConsumption = useQuery({
    queryKey: ['admin/statistics/appdefs/topTenAppCPUConsumingDefs'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_APP_DEFINITIONS'][]> =>
      fetch('/api/admin/statistics/getAppDefinitionsData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ graphInfo: 'topTenAppCPUConsumingDefs' }),
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
  const queryTopTenAppDefsWithMostMemoryConsumption = useQuery({
    queryKey: ['admin/statistics/appdefs/topTenAppMemoryConsumingDefs'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_APP_DEFINITIONS'][]> =>
      fetch('/api/admin/statistics/getAppDefinitionsData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ graphInfo: 'topTenAppMemoryConsumingDefs' }),
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

  // //That's the way u can give dynamic data to chartjs. It looks not pretty.
  // const getDatasetForTopTenAppDefsWithMostPopular = () => {
  //   const { data } = queryTopTenAppDefsWithMostPopular;
  //   if (data.length === 0) return [];
  //   else {
  //     let dataset: any[] = [];
  //     const appDefinitions: string = 'coffee-editor' || 'theia-cloud-demo' || 'cdt-cloud-demo';
  //     for (const each of data) {
  //       const labels = each.name;
  //       const wscount = each.wscount;
  //       if (appDefinitions.includes(labels) && wscount) {
  //         dataset.push({
  //           label: labels,
  //           data: wscount,
  //         });
  //       }
  //     }
  //     return dataset;
  //   }
  // };

  return (
    <>
      <Bar
        datasetIdKey='global-appdef-cpu-usage-table'
        options={{
          scales: {
            y: {
              ticks: {
                callback: function (value, index, ticks) {
                  return value + ' %';
                },
              },
            },
          },
        }}
        data={{
          labels: queryTopTenAppDefsWithMostCPUConsumption.data.map((row) => row.name),
          datasets: [
            {
              label: 'Top 10 App Definitions with Most CPU Resource Consumption',
              data: queryTopTenAppDefsWithMostCPUConsumption.data.map((row: any, i) => {
                return row.max_cpu / 10 ** 7;
              }),
              backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)'],
              borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)'],
              borderWidth: 1,
            },
          ],
        }}
      />
      <Bar
        datasetIdKey='global-appdef-memory-usage-table'
        options={{
          scales: {
            y: {
              ticks: {
                callback: function (value, index, ticks) {
                  return value + ' %';
                },
              },
            },
          },
        }}
        data={{
          labels: queryTopTenAppDefsWithMostMemoryConsumption.data.map((row) => row.name),
          datasets: [
            {
              label: 'Top 10 App Definitions with Most Memory Resource Consumption',
              data: queryTopTenAppDefsWithMostMemoryConsumption.data.map((row: any, i) => {
                return row.max_mem / 10 ** 7;
              }),
              backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)'],
              borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)'],
              borderWidth: 1,
            },
          ],
        }}
      />
      <Line
        datasetIdKey='global-appdefs-usage-table'
        data={{
          labels: queryTopTenAppDefsWithMostPopular.data
            .map((row: any) => dayjs(row.minute_ts).format('lll'))
            .reverse(),
          datasets: [
            {
              label: 'theia-cloud-demo',
              data: queryTopTenAppDefsWithMostPopular.data.map((row, i) => {
                if (row.name === 'theia-cloud-demo') {
                  return row.wscount;
                }
              }),
              tension: 0,
              spanGaps: true,
              borderColor: 'rgb(255, 99, 132)',
            },
            {
              label: 'cdt-cloud-demo',
              data: queryTopTenAppDefsWithMostPopular.data.map((row, i) => {
                if (row.name === 'cdt-cloud-demo') {
                  return row.wscount;
                }
              }),
              tension: 0,
              spanGaps: true,
              borderColor: 'rgb(255, 159, 64)',
            },
            {
              label: 'coffee-editor',
              data: queryTopTenAppDefsWithMostPopular.data.map((row, i) => {
                if (row.name === 'coffee-editor') {
                  return row.wscount;
                }
              }),
              tension: 0,
              spanGaps: true,
              borderColor: 'rgb(255, 205, 86)',
            },
          ],
        }}
      />
      <Line
        datasetIdKey='global-appdefs-usage-table-2'
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
            },
          ],
        }}
      />
    </>
  );
};

export default memo(GlobalAppDefUsageGraph);

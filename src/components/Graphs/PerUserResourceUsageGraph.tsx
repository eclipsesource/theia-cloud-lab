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
import annotationPlugin from 'chartjs-plugin-annotation';

dayjs.extend(localizedFormat);

const PerUserResourceUsageGraph = () => {
  const { keycloak } = useContext(Context);
  // Registering the chart.js plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

  const queryPerUserUsageTable = useQuery({
    queryKey: ['admin/statistics/perUser/usage'],
    queryFn: async () =>
      fetch('/api/admin/statistics/getTableData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ tableName: DB_TABLE_NAMES.GLOBAL_WORKSPACE_LIST, isPerUser: true }),
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

  const getDataForResourceConsumptionChartByUserAndWorkspace = () => {
    const { data } = queryPerUserUsageTable;
    if (data.length === 0) return [];
    const regex = /(\d*)(\D*)/;

    //create empty array for each user data
    let userArray: any[] = [];

    for (const each of data) {
      const dataArr = each.data;

      if (dataArr.length !== 0) {
        //get labels from workspace list
        const labels: string[] = dataArr.map((each: any) => dayjs(each.ts).format('lll'));

        //get cpu and memory data from workspace list
        const cpuDataSet = dataArr.map((each: any) => {
          if (each.cpu.match(regex)[1]) {
            return ((each.cpu.match(regex)[1] / 10 ** 9) * 10 ** 2).toFixed(3);
          }
        });

        const memoryDataSet = dataArr.map((each: any) => {
          if (each.memory.match(regex)[1]) {
            return (each.memory.match(regex)[1] / 1024).toFixed(3);
          }
        });

        const userId = each.user;
        const workspaceName = each.workspace;

        userArray.push([labels, cpuDataSet, memoryDataSet, userId, workspaceName]);
      }
    }

    // Returning the labels and dataSets, userId and workspaceName for the chart
    return userArray;
  };

  //Get label and data for Memory Consumption Per User Chart using getDataForResourceConsumptionChartByUserAndWorkspace()
  const getDataForMemoryConsumptionPerUserChart = () => {
    const data = getDataForResourceConsumptionChartByUserAndWorkspace();
    if (data.length === 0) return [];
    else {
      let allUsers: any[] = [];
      for (const each of data) {
        const userId = each[3];
        const labels = `Memory Consumption Per User: ${userId}`;
        const dataSets = each[2];
        //const workspaceName = each[4];
        allUsers.push({
          label: labels,
          data: distributeData(dataSets),
          tension: 0.4,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        });
      }
      return allUsers;
    }
  };

  //Get label and data for CPU Consumption Per User Chart using getDataForResourceConsumptionChartByUserAndWorkspace()
  const getDataForCPUConsumptionPerUserChart = () => {
    const data = getDataForResourceConsumptionChartByUserAndWorkspace();
    if (data.length === 0) return [];
    else {
      let allUsers: any[] = [];
      for (const each of data) {
        const userId = each[3];
        const labels = `CPU Consumption Per User: ${userId}`;
        const dataSets = each[1];
        //const workspaceName = each[4];
        allUsers.push({
          label: labels,
          data: distributeData(dataSets),
          spanGaps: true,
          tension: 0.4,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        });
      }
      return allUsers;
    }
  };

  const distributeData = (data: any) => {
    const distributed = data.map((row: any, i: number) => {
      if (i === 0) {
        return row;
      } else if (i === data.length - 1) {
        return row;
      } else if (data[i + 1] !== row) {
        return row;
      } else if (data[i - 1] === row) {
        return null;
      } else {
        return row;
      }
    });
    return distributed;
  };

  const average = (ctx: any, type: string) => {
    const avgData =
      type === 'cpu'
        ? getDataForCPUConsumptionPerUserChart()
            .map((each) => each.data)
            .flat(1)
        : type === 'memory'
        ? getDataForMemoryConsumptionPerUserChart()
            .map((each) => each.data)
            .flat(1)
        : [];

    return avgData.reduce((a: string, b: string) => Number(a) + Number(b), 0) / avgData.length;
  };

  const getAverageAnnotation = (type: string) => {
    const append = type === 'cpu' ? '%' : 'MiB';
    return {
      borderColor: 'black',
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 2,
      label: {
        content: (ctx: any) => `Average: ${average(ctx, type).toFixed(2)} ${append}`,
        position: 'end',
        backgroundColor: 'red',
        display: true,
      },
      scaleID: 'y',
      value: (ctx: any) => average(ctx, type),
    };
  };

  return (
    <>
      <Line
        datasetIdKey='id'
        options={{
          scales: {
            y: {
              ticks: {
                callback: function (value, index, ticks) {
                  return value + ' MiB';
                },
              },
            },
          },
          plugins: {
            annotation: {
              //@ts-ignore
              drawTime: 'afterDatasetsDraw',
              annotations: {
                averageAnnotation: getAverageAnnotation('memory'),
              },
            },
          },
        }}
        data={{
          labels: [
            ...Array.from(
              new Set(
                getDataForResourceConsumptionChartByUserAndWorkspace()
                  .map((each: any) => each[0])
                  .flat(1)
              )
            ),
          ],
          datasets: getDataForMemoryConsumptionPerUserChart(),
        }}
      />
      <Line
        datasetIdKey='id'
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
          plugins: {
            annotation: {
              annotations: {
                averageAnnotation: getAverageAnnotation('cpu'),
              },
            },
          },
        }}
        data={{
          labels: [
            ...Array.from(
              new Set(
                getDataForResourceConsumptionChartByUserAndWorkspace()
                  .map((each: any) => each[0])
                  .flat(1)
              )
            ),
          ],
          datasets: getDataForCPUConsumptionPerUserChart(),
        }}
      />
    </>
  );
};

export default memo(PerUserResourceUsageGraph);

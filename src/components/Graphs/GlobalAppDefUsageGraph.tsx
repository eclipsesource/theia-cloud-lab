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
import { DB_TABLE_ROW_TYPES } from '../../../types/Database';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { memo, useContext, useState } from 'react';
import { Context } from '../../context/Context';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId, GridToolbar } from '@mui/x-data-grid';

dayjs.extend(localizedFormat);

type SessionRow = {
  id: string;
  sum_ws: string;
  sum_session: string;
  sum_cpu: string;
  sum_mem: string;
  relative_cpu: string;
  relative_memory: string;
};

const GlobalAppDefUsageGraph = () => {
  const { keycloak } = useContext(Context);

  // Registering the chart.js plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

  const queryTopTenAppDefsWithMostCPUConsumption = useQuery({
    queryKey: ['admin/statistics/appdefs/topTenAppCPUConsumingDefs'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_APP_DEFINITIONS'][]> =>
      fetch('/api/admin/statistics/getAppDefinitionsData?graphInfo=topTenAppCPUConsumingDefs', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
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
      fetch('/api/admin/statistics/getAppDefinitionsData?graphInfo=topTenAppMemoryConsumingDefs', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
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
      fetch('/api/admin/statistics/getAppDefinitionsData?graphInfo=mostPopularAppDefs', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
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

  const queryTopTenAppDefsWithAverageCPUConsumption = useQuery({
    queryKey: ['admin/statistics/appdefs/averageCPUConsumption'],
    queryFn: async (): Promise<any> =>
      fetch('/api/admin/statistics/getAppDefinitionsData?graphInfo=averageCPUConsumption', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
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

  const queryTopTenAppDefsWithAverageMemConsumption = useQuery({
    queryKey: ['admin/statistics/appdefs/averageMemoryConsumption'],
    queryFn: async (): Promise<any> =>
      fetch('/api/admin/statistics/getAppDefinitionsData?graphInfo=averageMemoryConsumption', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
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

  const queryGetAppDefinitionsTableData = useQuery({
    queryKey: ['admin/statistics/appdefs/tableData'],
    queryFn: async (): Promise<any> =>
      fetch('/api/admin/statistics/getAppDefinitionsData?graphInfo=tableData', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
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

  const cpuFormat = (cpu: string) => {
    let formattedCpu = ((Number(cpu) / 10 ** 9) * (10 ** 2)).toFixed(3);
    return formattedCpu;
  };

  const memoryFormat = (memory: string) => {
    let formattedMemory = (Number(memory) / 1024).toFixed(3);
    return formattedMemory;
  };

  const getDataSetsArray = () => {
    const returnArr = [];

    for (const [key, value] of Object.entries(queryTopTenAppDefsWithAverageMemConsumption.data)) {
      let tmpObj = {
        label: key,
        borderColor: stringToColour(key),
        data: (value as any).map((each: any) => memoryFormat(each.averagememory)),
      };
      returnArr.push(tmpObj);
    }

    return returnArr;
  };

  const getDataSetsForCPU = () => {
    const returnArr = [];

    for (const [key, value] of Object.entries(queryTopTenAppDefsWithAverageCPUConsumption.data)) {
      let tmpObj = {
        label: key,
        borderColor: stringToColour(key),
        data: (value as any).map((each: any) => cpuFormat(each.averagecpu)),
      };
      returnArr.push(tmpObj);
    }

    return returnArr;
  };

  const stringToColour = (str: string) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 10)) & 0xff;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'App Definition Name', width: 250 },
    { field: 'sum_ws', headerName: 'Total Workspaces', width: 250 },
    { field: 'sum_session', headerName: 'Total Session', width: 250 },
    { field: 'sum_cpu', headerName: 'Total CPU', width: 250 },
    { field: 'sum_mem', headerName: 'Total Memory', width: 250 },
    { field: 'relative_cpu', headerName: 'Relative CPU', width: 250 },
    { field: 'relative_memory', headerName: 'Relative Memory', width: 250 },
  ];

  const setTableData = (): SessionRow[] => {
    if (queryGetAppDefinitionsTableData.data && queryGetAppDefinitionsTableData.data.length > 0) {
      let rows: SessionRow[] = []
      for (const each of queryGetAppDefinitionsTableData.data) {
        const row: SessionRow = {
          id: each.id,
          sum_ws: each.sum_ws,
          sum_session: each.sum_session,
          sum_cpu: `${cpuFormat(each.sum_cpu)} %`,
          sum_mem: `${memoryFormat(each.sum_mem)} MiB`,
          relative_cpu: `${cpuFormat(each.relative_cpu)} MiB`,
          relative_memory: `${memoryFormat(each.relative_memory)} MiB`,
        }
        rows.push(row)
      }
      return rows;
    }
    return []
  };

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
                return cpuFormat(row.max_cpu);
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
                  return value + ' MiB';
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
                return (row.max_mem / 1024).toFixed(3);
              }),
              backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)'],
              borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)'],
              borderWidth: 1,
            },
          ],
        }}
      />
      {/* <Line
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
      /> */}
      <h4> </h4>
      <Line
        datasetIdKey='global-appdefs-usage-table-2'
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
          labels: queryTopTenAppDefsWithAverageCPUConsumption.data[Object.keys(queryTopTenAppDefsWithAverageMemConsumption.data)[0]]?.map((each: any) =>
            dayjs(each.ts).format('lll')
          ),
          datasets: getDataSetsForCPU(),
        }}
      />
      <Line
        datasetIdKey='global-appdefs-usage-table-3'
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
        }}
        data={{
          labels: queryTopTenAppDefsWithAverageMemConsumption.data[Object.keys(queryTopTenAppDefsWithAverageMemConsumption.data)[0]]?.map((each: any) =>
            dayjs(each.ts).format('lll')
          ),
          datasets: getDataSetsArray(),
        }}
      />
      <div style={{ height: '500px', width: '100%', marginTop: '40px' }}>
        <DataGrid
          sx={{ height: 'calc(100% - 5rem)', width: '100%', borderRadius: 0 }}
          rows={setTableData()}
          columns={columns}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          getRowClassName={() => 'text-l'}
          components={{
            Toolbar: GridToolbar,
          }}
          loading={queryGetAppDefinitionsTableData.isFetching && queryGetAppDefinitionsTableData.data?.length === 0}
          getRowHeight={() => 'auto'}
        />
      </div>
    </>
  );
};

export default memo(GlobalAppDefUsageGraph);

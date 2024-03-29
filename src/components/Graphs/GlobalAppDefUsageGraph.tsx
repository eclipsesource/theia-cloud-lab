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
  active_time: string;
  total_cpu: string;
  avg_cpu_over_time: string;
  total_mem: string;
  avg_mem_over_time: string;
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

  const queryAllTimeLogs = useQuery({
    queryKey: ['admin/statistics/appdefs/allTimeLogs'],
    queryFn: async (): Promise<DB_TABLE_ROW_TYPES['GLOBAL_APP_DEFINITIONS'][]> =>
      fetch('/api/admin/statistics/getAppDefinitionsData?graphInfo=timelogs', {
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
    let formattedCpu = ((Number(cpu) / 10 ** 9) * 10 ** 2).toFixed(3);
    return formattedCpu;
  };

  const memoryFormat = (memory: string) => {
    let formattedMemory = (Number(memory) / 1024).toFixed(3);
    return formattedMemory;
  };

  const getDataSetsArray = () => {
    const returnArr = [];

    for (let [key, value] of Object.entries(queryTopTenAppDefsWithAverageMemConsumption.data)) {
      value = addMissingDataForAvg(queryAllTimeLogs.data, value);
      let tmpObj = {
        label: key,
        borderColor: stringToColour(key),
        data: (value as any).map((each: any) => memoryFormat(each.averagememory)),
        fill: false,
        lineTension: 0.3,
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
    { field: 'id', headerName: 'App Definition Name', width: 240 },
    { field: 'active_time', headerName: 'Total Active Time (mins)', width: 200 },
    { field: 'total_cpu', headerName: 'Total CPU', width: 200 },
    { field: 'avg_cpu_over_time', headerName: 'Average CPU Consumption Over Time', width: 270 },
    { field: 'total_mem', headerName: 'Total Memory', width: 200 },
    { field: 'avg_mem_over_time', headerName: 'Average Memory Consumption Over Time', width: 300 },
  ];

  const setTableData = (): SessionRow[] => {
    if (queryGetAppDefinitionsTableData.data && queryGetAppDefinitionsTableData.data.length > 0) {
      let rows: SessionRow[] = [];
      for (const each of queryGetAppDefinitionsTableData.data) {
        const row: SessionRow = {
          id: each.id,
          active_time: each.active_time,
          total_cpu: `${cpuFormat(each.total_cpu)} m`,
          total_mem: `${memoryFormat(each.total_mem)} MiB`,
          avg_cpu_over_time: `${cpuFormat(each.avg_cpu_over_time)}`,
          avg_mem_over_time: `${memoryFormat(each.avg_mem_over_time)}`,
        };
        rows.push(row);
      }
      return rows;
    }
    return [];
  };

  function addMissingDataForAvg(timeArr: any[], dataArr: any) {
    let dataMap = new Map();
    dataArr.forEach((d: any) =>
      dataMap.set(d.ts_min, {
        ts_min: d.ts_min,
        name: d.name,
        wscount: d.wscount,
        sessioncount: d.sessioncount,
        totalmemory: d.totalmemory,
        averagememory: d.averagememory,
      })
    );
    timeArr.forEach((t) => {
      if (!dataMap.has(t.ts_min)) {
        dataMap.set(t.ts_min, {
          ts_min: t.ts_min,
          name: dataArr[0].name,
          wscount: 0,
          sessioncount: 0,
          totalmemory: 0,
          averagememory: 0,
        });
      }
    });
    return Array.from(dataMap.values());
  }

  //   function getUniqueLabels(dataArr:any[]) {
  //     return Array.from(new Set(dataArr.map(d => d.name)));
  //   }

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
      <br />
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
      {/* <h4> Number of Workspace for the Most Popular App Definition per Minute</h4>
      <Line
        datasetIdKey='global-appdefs-usage-table'
        data={{
          labels: queryTopTenAppDefsWithMostPopular.data?.map((each: any) => dayjs(each.ts_min).format('lll')),
          datasets: getUniqueLabels(queryTopTenAppDefsWithMostPopular.data).map(name => {
            const filteredData =  queryTopTenAppDefsWithMostPopular.data.filter(d => d.name === name);
            const datasetData = filteredData.map(d => d.wscount);
            return {
              label: name,
              data: datasetData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              pointRadius: 5
            };
          })
        }}
      /> */}
      <br />
      <h4> Average CPU Usage per App Definition</h4>
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
          labels: queryAllTimeLogs.data?.map((each: any) => dayjs(each.ts_min).format('lll')),
          datasets: getDataSetsForCPU(),
        }}
      />
      <br />
      <h4> Average Memory Usage per App Definition</h4>
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
          labels: queryAllTimeLogs.data?.map((each: any) => dayjs(each.ts_min).format('lll')),
          datasets: getDataSetsArray(),
        }}
      />

      <div style={{ height: '500px', width: '100%', marginTop: '40px' }}>
        <h4> Average Consumption over Time(minute) </h4>
        <br />
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

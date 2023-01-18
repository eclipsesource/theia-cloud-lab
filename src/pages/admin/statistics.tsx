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
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import TheiaButton from '../../components/TheiaButton';
import RefreshIcon from '../../components/icons/RefreshIcon';
import Accordion from '@mui/material/Accordion';
import { AccordionDetails, AccordionSummary } from '@mui/material';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';
import annotationPlugin from 'chartjs-plugin-annotation';

dayjs.extend(localizedFormat);

const Statistics = () => {
  // Registering the chart.js plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

  const { keycloak } = useContext(Context);
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(false);
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(false);
  const [isCPUExpanded, setIsCPUExpanded] = useState(false);
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(false);
  const [isMemoryPerUserExpanded, setIsMemoryPerUserExpanded] = useState(false);
  const [isCPUPerUserExpanded, setIsCPUPerUserExpanded] = useState(false);

  // Fetching the statistics from the backend
  const getStatisticsResult = useQuery({
    queryKey: ['admin/statistics'],
    queryFn: async () =>
      fetch('/api/admin/statistics', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error getting statistics. Please try again later.');
        }
        return res.json();
      }),
    initialData: {},
    retry: false,
    refetchInterval: 60000,
  });

  console.log(getStatisticsResult.data);

  // Getting the data for the session chart from the statistics data
  const getDataForSessionChart = (type: string) => {
    const { data } = getStatisticsResult;
    if (!data.hasOwnProperty('rows') || data.rows.length === 0) return { labels: [], dataSets: [] };

    //If the type is sessions, we want to get the data for the sessions chart,
    // else we want to get the data for the workspaces chart
    const arr = type === 'sessions' ? data.rows[0] : type === 'workspaces' ? data.rows[2] : [];

    const labels = arr.map((session: any) => dayjs(session.ts).format('lll'));
    const dataSets = arr.map((session: any) => session.number);

    // Returning the labels and dataSets for the chart
    return { labels, dataSets };
  };

  const getDataForResourceConsumptionChart = () => {
    const { data } = getStatisticsResult;
    if (!data.hasOwnProperty('rows') || data.rows.length === 0) return { labels: [], dataSets: [] };
    const regex = /(\d*)(\D*)/;

    const arr = data.rows[1];

    const labels = arr.map((session: any) => dayjs(session.ts).format('lll'));
    const cpuDataSet = arr.map((session: any) => {
      if (session.cpu.match(regex)[1]) {
        return ((session.cpu.match(regex)[1] / 10 ** 9) * 10 ** 2).toFixed(3);
      }
    });
    const memoryDataSet = arr.map((session: any) => {
      if (session.memory.match(regex)[1]) {
        return (session.memory.match(regex)[1] / 1024).toFixed(3);
      }
    });

    // Returning the labels and dataSets for the chart
    return { labels, cpuDataSet, memoryDataSet };
  };

  const getDataForResourceConsumptionChartByUserAndWorkspace = () => {
    const { data } = getStatisticsResult;
    if (!data.hasOwnProperty('rows') || data.rows.length === 0) return [];
    const regex = /(\d*)(\D*)/;

    //extract 4th row
    const arr = data.rows[3];

    //create empty array for each user data
    let userArray: any[] = [];

    for (const each of arr) {
      const data = each.data;

      //get labels from workspace list
      const labels: string[] = data.map((each: any) => dayjs(each.ts).format('lll'));

      //get cpu and memory data from workspace list
      const cpuDataSet = data.map((each: any) => {
        if (each.cpu.match(regex)[1]) {
          return ((each.cpu.match(regex)[1] / 10 ** 9) * 10 ** 2).toFixed(3);
        }
      });

      const memoryDataSet = data.map((each: any) => {
        if (each.memory.match(regex)[1]) {
          return (each.memory.match(regex)[1] / 1024).toFixed(3);
        }
      });

      const userId = each.user;
      const workspaceName = each.workspace;

      userArray.push([labels, cpuDataSet, memoryDataSet, userId, workspaceName]);
    }

    // Returning the labels and dataSets, userId and workspaceName for the chart
    return userArray;
  };

  //Get label and data for Memory Consumption Per User Chart using getDataForResourceConsumptionChartByUserAndWorkspace() result
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
        allUsers.push({ label: labels, data: dataSets, tension: 0.4, fill: false, borderColor: 'rgb(75, 192, 192)' });
      }
      return allUsers;
    }
  };

  // const getRandomBorderColor = () => {
  //   var num = Math.round(0xffffff * Math.random());
  //   var r = num >> 16;
  //   var g = num >> 8 & 255;
  //   var b = num & 255;
  //   return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  // }

  console.log(getDataForMemoryConsumptionPerUserChart());

  const average = (ctx: any) => {
    const values = ctx.chart.data.datasets[0].data;
    return values.reduce((a: string, b: string) => Number(a) + Number(b), 0) / values.length;
  };

  const getAverageAnnotation = (type: string) => {
    const append = type === 'cpu' ? '%' : 'MiB';
    return {
      borderColor: 'black',
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 2,
      label: {
        content: (ctx: any) => `Average: ${average(ctx).toFixed(2)} ${append}`,
        position: 'end',
        backgroundColor: 'red',
        display: true,
      },
      scaleID: 'y',
      value: (ctx: any) => average(ctx),
    };
  };

  const LineChartForGlobalCPUConsumption = () => {
    return (
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
          labels: getDataForResourceConsumptionChart()['labels'],
          datasets: [
            {
              label: 'CPU Usage',
              data: getDataForResourceConsumptionChart()['cpuDataSet'],
              tension: 0.4,
              fill: false,
              borderColor: 'rgb(0, 0, 255)',
            },
          ],
        }}
      />
    );
  };

  const LineChartForGlobalMemoryConsumption = () => {
    return (
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
              annotations: {
                averageAnnotation: getAverageAnnotation('memory'),
              },
            },
          },
        }}
        data={{
          labels: getDataForResourceConsumptionChart()['labels'],
          datasets: [
            {
              label: 'Memory Usage',
              data: getDataForResourceConsumptionChart()['memoryDataSet'],
              tension: 0.4,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
            },
          ],
        }}
      />
    );
  };

  const LineChartForMemoryConsumptionPerUser = () => {
    return (
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
        }}
        data={{
          labels: getDataForResourceConsumptionChartByUserAndWorkspace()
            .map((each: any) => each[0])
            .flat(1),
          datasets: getDataForMemoryConsumptionPerUserChart(),
        }}
      />
    );
  };

  const LineChartForSessions = () => {
    return (
      <Line
        datasetIdKey='id'
        data={{
          labels: getDataForSessionChart('sessions')['labels'],
          datasets: [
            {
              label: 'Number of Sessions',
              data: getDataForSessionChart('sessions')['dataSets'],
              tension: 0.4,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
            },
          ],
        }}
      />
    );
  };

  const LineChartForWorkspaces = () => {
    return (
      <Line
        datasetIdKey='id'
        data={{
          labels: getDataForSessionChart('workspaces')['labels'],
          datasets: [
            {
              label: 'Number of Workspaces',
              data: getDataForSessionChart('workspaces')['dataSets'],
              tension: 0.4,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
            },
          ],
        }}
      />
    );
  };

  const Collapsible = (props: {
    title: string;
    expanded?: boolean;
    onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
    children: JSX.Element;
  }): React.ReactElement => {
    return (
      <Accordion
        expanded={props.expanded}
        onChange={props.onChange}
        sx={{
          margin: 0,
        }}
      >
        <AccordionSummary
          expandIcon={<ChevronDownIcon />}
          id='panel1a-header'
        >
          {props.title}
        </AccordionSummary>
        <AccordionDetails>{props.children}</AccordionDetails>
      </Accordion>
    );
  };

  return (
    <>
      <div className='flex py-4 px-5 shadow-sm h-20 items-center justify-between'>
        <span className='text-xl text-gray-600'>Statistics</span>
        <TheiaButton
          text='Refresh'
          icon={<RefreshIcon />}
          onClick={() => getStatisticsResult.refetch()}
          disabled={getStatisticsResult.isFetching}
        />
      </div>
      <div className='p-5 flex gap-5 flex-col'>
        <Collapsible
          title='Sessions'
          expanded={isSessionsExpanded}
          onChange={(event, expanded) => {
            setIsSessionsExpanded(expanded);
          }}
        >
          <LineChartForSessions />
        </Collapsible>
        <Collapsible
          title='Workspaces'
          expanded={isWorkspacesExpanded}
          onChange={(event, expanded) => {
            setIsWorkspacesExpanded(expanded);
          }}
        >
          <LineChartForWorkspaces />
        </Collapsible>
        <Collapsible
          title='Global CPU Consumption'
          expanded={isCPUExpanded}
          onChange={(event, expanded) => {
            setIsCPUExpanded(expanded);
          }}
        >
          <LineChartForGlobalCPUConsumption />
        </Collapsible>
        <Collapsible
          title='Global Memory Consumption'
          expanded={isMemoryExpanded}
          onChange={(event, expanded) => {
            setIsMemoryExpanded(expanded);
          }}
        >
          <LineChartForGlobalMemoryConsumption />
        </Collapsible>
        <Collapsible
          title='CPU Consumption per User'
          expanded={isCPUPerUserExpanded}
          onChange={(event, expanded) => {
            setIsCPUPerUserExpanded(expanded);
          }}
        >
          <LineChartForGlobalMemoryConsumption />
        </Collapsible>
        <Collapsible
          title='Memory Consumption per User'
          expanded={isMemoryPerUserExpanded}
          onChange={(event, expanded) => {
            setIsMemoryPerUserExpanded(expanded);
          }}
        >
          <LineChartForMemoryConsumptionPerUser />
        </Collapsible>
      </div>
    </>
  );
};
export default Statistics;

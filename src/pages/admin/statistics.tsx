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
import React, { Children, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import TheiaButton from '../../components/TheiaButton';
import RefreshIcon from '../../components/icons/RefreshIcon';
import Accordion from '@mui/material/Accordion';
import { AccordionDetails, AccordionSummary } from '@mui/material';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';

dayjs.extend(localizedFormat);

type SessionWorkspaceRow = {
  ts: Date;
  number: number;
};

const Statistics = () => {
  // Registering the chart.js plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const { keycloak } = useContext(Context);
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(false);
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(false);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);

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
    initialData: [],
    retry: false,
    refetchInterval: 60000,
  });

  // Getting the data for the session chart from the statistics data
  const getDataForSessionChart = (type: string) => {
    const { data } = getStatisticsResult;
    if (data.length === 0) return { labels: [], dataSets: [] };

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
    if (data.length === 0) return { labels: [], dataSets: [] };
    const regex = /(\d*)(\D*)/;

    const arr = data.rows[1];

    console.log(arr);

    const labels = arr.map((session: any) => dayjs(session.ts).format('lll'));
    const cpuDataSet = arr.map((session: any) => session.cpu.match(regex)[1]);
    const memoryDataSet = arr.map((session: any) => session.memory.match(regex)[1]);

    // Returning the labels and dataSets for the chart
    return { labels, cpuDataSet, memoryDataSet };
  };

  const LineChartForGlobalResourceConsumption = () => {
    return (
      <Line
        datasetIdKey='id'
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
      <div className='ml-5 mt-5 mr-5'>
        <Collapsible
          title='Sessions'
          expanded={isSessionsExpanded}
          onChange={(event, expanded) => {
            setIsSessionsExpanded(expanded);
          }}
        >
          <LineChartForSessions />
        </Collapsible>
      </div>
      <div className='ml-5 mt-5 mr-5'>
        <Collapsible
          title='Workspaces'
          expanded={isWorkspacesExpanded}
          onChange={(event, expanded) => {
            setIsWorkspacesExpanded(expanded);
          }}
        >
          <LineChartForWorkspaces />
        </Collapsible>
      </div>
      <div className='ml-5 mt-5 mr-5'>
        <Collapsible
          title='Resource Consumption'
          expanded={isResourcesExpanded}
          onChange={(event, expanded) => {
            setIsResourcesExpanded(expanded);
          }}
        >
          <LineChartForGlobalResourceConsumption />
        </Collapsible>
      </div>
    </>
  );
};
export default Statistics;

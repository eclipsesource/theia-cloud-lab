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
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

const Statistics = () => {
  // Registering the chart.js plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const { keycloak } = useContext(Context);
  const [sessionLabels, setSessionLabels] = useState([]);
  const [sessionDataSets, setSessionDataSets] = useState([]);

  // Fetching the statistics
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
  });

  const getDataForSessionChart = () => {
    const { data } = getStatisticsResult;
    if (data.length === 0) return { labels: [], dataSets: [] };
    const sessionList = data.rows[0];
    const labels = sessionList.map((session: any) => dayjs(session.ts).format('LLLL'));
    const dataSets = sessionList.map((session: any) => session.number);
    return { labels, dataSets };
  };

  return (
    <div className='flex'>
      <Line
        datasetIdKey='id'
        data={{
          labels: getDataForSessionChart()['labels'],
          datasets: [
            {
              label: 'Number of sessions active',
              data: getDataForSessionChart()['dataSets'],
              tension: 0.4,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
            },
          ],
        }}
      />
    </div>
  );
};
export default Statistics;

import { Switch } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../../components/icons/Spinner';
import { Context } from '../../context/Context';

const Settings = () => {
  const { keycloak } = useContext(Context);

  const startMetricFetchingResult = useQuery({
    queryKey: ['admin/metrics/gatherStatistics/start'],
    queryFn: async () =>
      fetch('/api/admin/metrics/gatherStatistics', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ start: true }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error starting fetching interval of metrics. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    staleTime: Infinity,
    retry: false,
    onSettled: () => {
      getMetricFetchingStatusResult.refetch();
    },
  });

  const stopMetricFetchingResult = useQuery({
    queryKey: ['admin/metrics/gatherStatistics/stop'],
    queryFn: async () =>
      fetch('/api/admin/metrics/gatherStatistics', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ stop: true }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error stopping fetching interval of metrics. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    staleTime: Infinity,
    retry: false,
    onSettled: () => {
      getMetricFetchingStatusResult.refetch();
    },
  });

  const getMetricFetchingStatusResult = useQuery({
    queryKey: ['admin/metrics/gatherStatistics/getStatus'],
    queryFn: async (): Promise<{ status: boolean }> =>
      fetch('/api/admin/metrics/gatherStatistics', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error getting status of fetching interval of metrics. Please try again later.');
        }
        return res.json();
      }),
    retry: false,
    initialData: { status: false },
  });

  return (
    <>
      <div className='flex py-4 px-5 shadow-sm h-20 items-center'>
        <span className='text-xl text-gray-600'>Settings</span>
      </div>

      <div className='flex px-5 py-4'>
        <div className='flex items-center'>
          <span>Log cluster-wide metrics to database?</span>
          <div className='flex items-center ml-4'>
            <span className='text-gray-400'>Off</span>
            <Switch
              onChange={(e) => {
                if (e.target.checked) {
                  startMetricFetchingResult.refetch();
                } else {
                  stopMetricFetchingResult.refetch();
                }
              }}
              checked={getMetricFetchingStatusResult.data.status}
              disabled={
                getMetricFetchingStatusResult.isFetching ||
                startMetricFetchingResult.isFetching ||
                stopMetricFetchingResult.isFetching
              }
            />
            On
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

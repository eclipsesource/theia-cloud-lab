import { Switch } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../../components/icons/Spinner';
import { Context } from '../../context/Context';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Settings = () => {
  const [checked, setChecked] = useState(false);
  const { keycloak } = useContext(Context);

  const startMetricFetchingResult = useQuery({
    queryKey: ['admin/metrics/gatherStatistics/start'],
    queryFn: () =>
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
  });

  const stopMetricFetchingResult = useQuery({
    queryKey: ['admin/metrics/gatherStatistics/stop'],
    queryFn: () =>
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
  });

  useEffect(() => {
    if (checked) {
      startMetricFetchingResult.refetch();
    } else if (startMetricFetchingResult.data && !checked) {
      stopMetricFetchingResult.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <>
      <div className='flex py-4 px-5 shadow-sm h-20 items-center'>
        <span className='text-xl text-gray-600'>Settings</span>
      </div>

      {startMetricFetchingResult.isFetching || stopMetricFetchingResult.isFetching ? (
        <div className='flex h-[calc(100vh-5rem)] items-center justify-center'>
          <Spinner />
        </div>
      ) : (
        <div className='flex px-5 py-4'>
          <div className='flex items-center'>
            <span>Do you want to collect resource usage statistics?</span>
            <div className='flex items-center ml-4'>
              <span className='text-gray-400'>Off</span>
              <Switch
                {...label}
                onChange={(e) => setChecked(e.target.checked)}
                checked={checked}
              />
              On
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;

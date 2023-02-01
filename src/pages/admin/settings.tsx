import { InputAdornment, MenuItem, Switch, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Context } from '../../context/Context';

const Settings = () => {
  const { keycloak } = useContext(Context);
  const [globalDataRetentionWindow, setGlobalDataRetentionWindow] = useState(1);
  const [workspaceDataRetentionWindow, setWorkspaceDataRetentionWindow] = useState(1);

  const days = Array.from(Array(15).keys()).map((i) => ({ value: i + 1, label: i + 1 }));

  const startMetricFetchingResult = useQuery({
    queryKey: ['admin/metrics/gatherStatistics/start'],
    queryFn: async () =>
      fetch('/api/admin/statistics/gatherStatistics', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ start: true, globalDataRetentionWindow, workspaceDataRetentionWindow }),
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
      fetch('/api/admin/statistics/gatherStatistics', {
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
    queryFn: async (): Promise<{
      status: boolean;
      globalDataRetentionWindow: number;
      workspaceDataRetentionWindow: number;
    }> =>
      fetch('/api/admin/statistics/gatherStatistics', {
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
    initialData: { status: false, globalDataRetentionWindow: 1, workspaceDataRetentionWindow: 1 },
  });

  return (
    <>
      <div className='flex h-20 items-center py-4 px-5 shadow-sm'>
        <span className='text-xl text-gray-600'>Settings</span>
      </div>

      <div className='flex h-[calc(100vh-5rem)] w-full flex-col px-5 py-4'>
        <div className='ml-5'>
          <div>
            <span className='mr-5'>Log cluster-wide metrics to database?</span>
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
            <span className='text-gray-400'>On</span>
          </div>
          <div className='ml-5'>
            <div className='flex flex-row items-center '>
              <span className={`ml-5 ${getMetricFetchingStatusResult.data.status ? 'text-gray-400' : ''}`}>
                Data retention for global tables in number of days:
              </span>
              <span className='ml-5'>
                <TextField
                  disabled={getMetricFetchingStatusResult.data.status}
                  id='outlined-number'
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type='number'
                  value={
                    getMetricFetchingStatusResult.data.status
                      ? getMetricFetchingStatusResult.data.globalDataRetentionWindow
                      : globalDataRetentionWindow
                  }
                  style={{ width: 75 }}
                  onChange={(e) => setGlobalDataRetentionWindow(Number(e.target.value))}
                  defaultValue={1}
                  size='small'
                >
                  {days.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </span>
            </div>
            <div className='flex flex-row items-center '>
              <span className={`ml-5 ${getMetricFetchingStatusResult.data.status ? 'text-gray-400' : ''}`}>
                Data retention for workspace specific tables in number of days:{' '}
              </span>
              <span className='ml-5'>
                <TextField
                  disabled={getMetricFetchingStatusResult.data.status}
                  id='outlined-number'
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type='number'
                  value={
                    getMetricFetchingStatusResult.data.status
                      ? getMetricFetchingStatusResult.data.workspaceDataRetentionWindow
                      : workspaceDataRetentionWindow
                  }
                  style={{ width: 75 }}
                  onChange={(e) => setWorkspaceDataRetentionWindow(Number(e.target.value))}
                  defaultValue={1}
                  size='small'
                >
                  {days.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

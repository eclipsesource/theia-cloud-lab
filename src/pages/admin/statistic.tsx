import TheiaButton from '../../components/TheiaButton';
import { Prisma } from '@prisma/client';
import { useContext, useState } from 'react';
import { Context } from '../../context/Context';
import { useQuery } from '@tanstack/react-query';

const Statistic = () => {
  const { keycloak } = useContext(Context);
  const [data, setData] = useState<Prisma.StatisticCreateInput[]>([]);

  const createSessionResult = useQuery({
    queryKey: ['admin/stats'],
    queryFn: () =>
      fetch('/api/admin/stats/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({
          cpuUsage: '1',
          memoryUsage: '2',
          sessionCount: '3',
          workspaceCount: '4',
        }),
      }).then((res) => {
        if (!res.ok) {
          console.log('There was an error. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    staleTime: Infinity,
    retry: false,
  });

  console.log(createSessionResult.data);

  return (
    <>
      <TheiaButton
        text='Click me to insert sth to mongo db'
        onClick={() => createSessionResult.refetch()}
      ></TheiaButton>
      <>
        {createSessionResult.data && (
          <div className='flex flex-col'>
            <span
              className='mb-2'
              key={createSessionResult.data.id}
            >
              CPU: {createSessionResult.data.cpuUsage}
            </span>
            <span
              className='mb-2'
              key={createSessionResult.data.id}
            >
              MEMORY: {createSessionResult.data.memoryUsage}
            </span>
            <span
              className='mb-2'
              key={createSessionResult.data.id}
            >
              WORKSPACE COUNT: {createSessionResult.data.workspaceCount}
            </span>
            <span
              className='mb-2'
              key={createSessionResult.data.id}
            >
              SESSIOIN COUNT: {createSessionResult.data.sessionCount}
            </span>
          </div>
        )}
      </>
    </>
  );
};

export default Statistic;

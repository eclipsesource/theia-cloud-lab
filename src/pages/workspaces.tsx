import { useContext, useEffect, useState } from 'react';
import { IPodMetric } from './api/admin/metrics';
import RefreshIcon from '../components/icons/RefreshIcon';
import TheiaButton from '../components/TheiaButton';
import WorkspaceCard, { WorkspaceCardProps } from '../components/WorkspaceCard';
import { KeycloakContext } from '../context/KeycloakContext';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { SessionCRData } from './api/admin/sessions/cr';
import { UserWorkspaceCRData } from '../../types/UserWorkspaceCRData';

const Workspaces = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [workspaces, setWorkspaces] = useState<UserWorkspaceCRData[]>([]);
  const [workspaceCardsData, setWorkspaceCardsData] = useState<WorkspaceCardProps[]>([]);
  const { keycloak } = useContext(KeycloakContext);
  const [isMounted, SetIsMounted] = useState(false);

  const setCardsData = (workspaces: UserWorkspaceCRData[]) => {
    const cardsData: WorkspaceCardProps[] = [];
    for (const workspace of workspaces) {
      const cardData: WorkspaceCardProps = {
        name: workspace.name,
        creationTimestamp: 'CREATION TIMESTAMP',
        appDefinition: workspace.appDefinition,
        url: 'URL',
        cpuUsage: 'CPU',
        memoryUsage: 'MEMORY',
      };
      cardsData.push(cardData);
    }
    setWorkspaceCardsData(cardsData);
  };

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/user/workspaces', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        setWorkspaces(data);
      })
      .catch((error) => {
        console.log('Error occurred fetching workspaces: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    SetIsMounted(true);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  useEffect(() => {
    if (workspaces) {
      setCardsData(workspaces);
    }
  }, [workspaces]);

  return (
    <div className='w-full h-full'>
      <div className='flex p-4 shadow-sm h-16 items-center justify-between'>
        <span className='text-lg text-gray-600 '>Workspaces</span>
        <TheiaButton
          text='Refresh'
          icon={
            <button className={`${isFetching ? 'animate-spin' : ''} hover:animate-pulse`}>
              <RefreshIcon />
            </button>
          }
          onClick={fetchData}
        />
      </div>
      <div className='flex p-5 w-full h-[calc(100vh-4rem)]'>
        {isFetching ? (
          <div className='flex justify-center items-center w-full'>
            <CircularProgress />
          </div>
        ) : (
          <>
            {workspaceCardsData && workspaceCardsData.length > 0 ? (
              workspaceCardsData.map((cardProps) => (
                <WorkspaceCard
                  key={cardProps.name}
                  {...cardProps}
                />
              ))
            ) : (
              <div>No workspaces found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Workspaces;

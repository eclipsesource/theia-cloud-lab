import { useContext, useEffect, useState } from 'react';
import { IPodMetric } from './api/metrics';
import RefreshIcon from '../components/icons/RefreshIcon';
import TheiaButton from '../components/TheiaButton';
import WorkspaceCard, { WorkspaceCardProps } from '../components/WorkspaceCard';
import { KeycloakContext } from '../context/KeycloakContext';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { WorkspaceCRData } from './api/workspaces/cr';
import { SessionCRData } from './api/sessions/cr';

const Workspaces = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [sessions, setSessions] = useState<SessionCRData[]>([]);
  const [metrics, setMetrics] = useState<IPodMetric[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceCRData[]>([]);
  const [workspaceCardsData, setWorkspaceCardsData] = useState<WorkspaceCardProps[]>([]);
  const { keycloak } = useContext(KeycloakContext);
  const [isMounted, SetIsMounted] = useState(false);

  const setCardsData = (sessions: SessionCRData[], metrics: IPodMetric[], workspaces: WorkspaceCRData[]) => {
    const cardsData: WorkspaceCardProps[] = [];
    for (const session of sessions) {
      let isMatched = false;
      for (const podMetric of metrics) {
        if (podMetric.metadata?.labels && session.name === podMetric.metadata?.labels.app) {
          isMatched = true;
          const cardData: WorkspaceCardProps = {
            name: session.name,
            creationTimestamp: dayjs(session.creationTimestamp).toString(),
            appDefinition: session.appDefinition,
            url: session.url,
            cpuUsage: podMetric.containers[0].usage.cpu,
            memoryUsage: podMetric.containers[0].usage.memory,
          };
          cardsData.push(cardData);
          break;
        }
      }
      if (!isMatched) {
        const cardData: WorkspaceCardProps = {
          name: session.name,
          creationTimestamp: dayjs(session.creationTimestamp).toString(),
          appDefinition: session.appDefinition,
          url: session.url,
          cpuUsage: '...',
          memoryUsage: '...',
        };
        cardsData.push(cardData);
      }
    }
    setWorkspaceCardsData(cardsData);
  };

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/sessions/cr', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
      })
      .then(() => {
        fetch('/api/metrics', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
          method: 'GET',
        })
          .then((res) => res.json())
          .then((data) => {
            setMetrics(data);
          })
          .then(() =>
            fetch('/api/workspaces/cr', {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${keycloak.token}`,
              },
              method: 'GET',
            })
              .then((res) => res.json())
              .then((data) => {
                setWorkspaces(data);
              })
              .catch((error) => {
                console.log('Error occurred fetching workspaces: ', error);
              })
          )
          .catch((error) => {
            console.log('Error occurred fetching metrics: ', error);
          });
      })
      .catch((error) => {
        console.log('Error occurred fetching sessions: ', error);
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
  }, [isMounted]);

  useEffect(() => {
    if (sessions) {
      setCardsData(sessions, metrics, workspaces);
    }
  }, [sessions, metrics, workspaces]);

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

import { useContext, useEffect, useState } from 'react';
import RefreshIcon from '../components/icons/RefreshIcon';
import TheiaButton from '../components/TheiaButton';
import WorkspaceCard, { WorkspaceCardProps } from '../components/WorkspaceCard';
import { KeycloakContext } from '../context/KeycloakContext';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { UserWorkspaceCRData } from '../../types/UserWorkspaceCRData';
import { UserSessionCRData } from '../../types/UserSessionCRData';
import PlusIcon from '../components/icons/PlusIcon';

const Workspaces = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [sessions, setSessions] = useState<UserSessionCRData[]>([]);
  const [workspaces, setWorkspaces] = useState<UserWorkspaceCRData[]>([]);
  const [workspaceCardsData, setWorkspaceCardsData] = useState<WorkspaceCardProps[]>([]);
  const { keycloak } = useContext(KeycloakContext);
  const [isMounted, SetIsMounted] = useState(false);

  const setCardsData = (workspaces: UserWorkspaceCRData[], sessions: UserSessionCRData[]) => {
    const cardsData: WorkspaceCardProps[] = [];
    for (const workspace of workspaces) {
      let isMatched = false;
      for (const session of sessions) {
        if (session.workspace === workspace.name) {
          isMatched = true;
          const cardData: WorkspaceCardProps = {
            status: 'Running',
            name: workspace.name,
            lastActivity: dayjs(session.lastActivity).toString(),
            appDefinition: workspace.appDefinition,
            url: session.url,
            cpuUsage: 'CPU',
            memoryUsage: 'MEMORY',
          };
          cardsData.push(cardData);
          break;
        }
      }
      if (!isMatched) {
        const cardData: WorkspaceCardProps = {
          status: 'Stopped',
          name: workspace.name,
          lastActivity: 'No Data',
          appDefinition: workspace.appDefinition,
          url: '',
          cpuUsage: 'CPU',
          memoryUsage: 'MEMORY',
        };
        cardsData.push(cardData);
      }
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
        console.log('workspaces', data);
        setWorkspaces(data);
      })
      .catch((error) => {
        console.log('Error occurred fetching workspaces: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });

    fetch('/api/user/sessions', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('sessions', data);
        setSessions(data);
      })
      .catch((error) => {
        console.log('Error occurred fetching workspaces: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const createWorkspace = () => {
    setIsFetching(true);
    fetch('/api/user/sessions', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ appDefinition: 'theia-cloud-demo' }),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchData();
        console.log('createWorkspace', data);
      })
      .catch((error) => {
        console.log('Error occurred creating workspace: ', error);
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
      setCardsData(workspaces, sessions);
    }
  }, [workspaces, sessions]);

  return (
    <div className='w-full h-full'>
      <div className='flex p-4 shadow-sm h-16 items-center justify-between'>
        <span className='text-lg text-gray-600 '>Workspaces</span>
        <span className='flex gap-4 '>
          <TheiaButton
            text='Create Workspace'
            icon={<PlusIcon className={`${isFetching ? 'animate-spin' : ''} hover:animate-pulse`} />}
            onClick={createWorkspace}
          />
          <TheiaButton
            text='Refresh'
            icon={<RefreshIcon className={`hover:animate-pulse`} />}
            onClick={fetchData}
          />
        </span>
      </div>
      <div className='flex p-5 w-full h-[calc(100vh-4rem)] flex-col gap-6'>
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

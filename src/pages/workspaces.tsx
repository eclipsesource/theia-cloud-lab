import { useContext, useEffect } from 'react';
import RefreshIcon from '../components/icons/RefreshIcon';
import TheiaButton from '../components/TheiaButton';
import UserWorkspaceCard, { UserWorkspaceCardProps } from '../components/UserWorkspaceCard';
import { KeycloakContext } from '../context/KeycloakContext';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { UserWorkspaceCRData } from '../../types/UserWorkspaceCRData';
import { UserSessionCRData } from '../../types/UserSessionCRData';
import PlusIcon from '../components/icons/PlusIcon';
import { useQueries, useQuery } from '@tanstack/react-query';

const Workspaces = () => {
  const { keycloak } = useContext(KeycloakContext);

  const fetchUserWorkspaces = async (): Promise<UserWorkspaceCRData[]> =>
    fetch('/api/user/workspaces', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    }).then((res) => res.json());

  const fetchUserSessions = async (): Promise<UserSessionCRData[]> =>
    fetch('/api/user/sessions', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      method: 'GET',
    }).then((res) => res.json());

  const createUserWorkspace = async (): Promise<any> =>
    fetch('/api/user/sessions', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ appDefinition: 'theia-cloud-demo' }),
    }).then((res) => res.json());

  const createUserWorkspaceResult = useQuery({
    queryKey: ['user/createWorkspace'],
    queryFn: createUserWorkspace,
    enabled: false,
  });

  const results = useQueries({
    queries: [
      { queryKey: ['user/workspaces'], queryFn: fetchUserWorkspaces },
      { queryKey: ['user/sessions'], queryFn: fetchUserSessions },
    ],
  });

  const renderWorkspaceCards = () => {
    if (results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching) {
      return (
        <div className='flex justify-center items-center w-full h-full'>
          <CircularProgress />
        </div>
      );
    } else if (results[0].data && results[1].data && results[0].data.length > 0) {
      const cardsData: UserWorkspaceCardProps[] = [];
      for (const workspace of results[0].data) {
        let isMatched = false;
        for (const session of results[1].data) {
          if (session.workspace === workspace.name) {
            isMatched = true;
            const cardData: UserWorkspaceCardProps = {
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
          const cardData: UserWorkspaceCardProps = {
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
      return cardsData.map((cardData) => (
        <UserWorkspaceCard
          key={cardData.name}
          {...cardData}
        />
      ));
    } else {
      return (
        <div className='flex justify-center items-center w-full h-full'>
          <span className='text-gray-400'>No Workspaces</span>
        </div>
      );
    }
  };

  return (
    <div className='w-full h-full'>
      <div className='flex p-4 shadow-sm h-16 items-center justify-between'>
        <span className='text-lg text-gray-600 '>Workspaces</span>
        <span className='flex gap-4 '>
          <TheiaButton
            text='Create Workspace'
            icon={<PlusIcon className={'hover:animate-pulse'} />}
            onClick={() => {
              createUserWorkspaceResult.refetch();
            }}
            disabled={results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching}
          />
          <TheiaButton
            text='Refresh'
            icon={<RefreshIcon className={`hover:animate-pulse`} />}
            onClick={() => {
              results[0].refetch();
              results[1].refetch();
            }}
            disabled={results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching}
          />
        </span>
      </div>
      <div className='flex p-5 w-full h-[calc(100vh-4rem)] flex-col gap-6'>{renderWorkspaceCards()}</div>
    </div>
  );
};

export default Workspaces;

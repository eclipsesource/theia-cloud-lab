import { useContext } from 'react';
import RefreshIcon from '../components/icons/RefreshIcon';
import TheiaButton from '../components/TheiaButton';
import UserWorkspaceCard, { UserWorkspaceCardProps } from '../components/UserWorkspaceCard';
import { Context } from '../context/Context';
import CircularProgress from '@mui/material/CircularProgress';
import PlusIcon from '../components/icons/PlusIcon';
import { useQueries } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { UserSessionCRData } from '../../types/UserSessionCRData';
import { UserWorkspaceCRData } from '../../types/UserWorkspaceCRData';
import UserCreateWorkspaceModalContent from '../components/TheiaModalContents/UserCreateWorkspaceModalContent';

const Workspaces = () => {
  const { keycloak, setModalContent, setIsModalOpen, userCreateWorkspaceIsFetching } = useContext(Context);

  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 100,
    easing: 'ease-in-out',
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ['user/workspaces'],
        queryFn: async (): Promise<UserWorkspaceCRData[]> =>
          fetch('/api/user/workspaces', {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'GET',
          }).then((res) => {
            if (!res.ok) {
              toast.error('There was an error fetching workspaces. Please try again later.');
            }
            return res.json();
          }),
        initialData: [],
        retry: false,
      },
      {
        queryKey: ['user/sessions'],
        queryFn: async (): Promise<UserSessionCRData[]> =>
          fetch('/api/user/sessions', {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'GET',
          }).then((res) => {
            if (!res.ok) {
              toast.error('There was an error fetching sessions. Please try again later.');
            }
            return res.json();
          }),
        initialData: [],
        retry: false,
      },
      {
        queryKey: ['user/appDefinitions'],
        queryFn: async (): Promise<UserSessionCRData[]> =>
          fetch('/api/user/appDefinitions', {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'GET',
          }).then((res) => {
            if (!res.ok) {
              toast.error('There was an error fetching sessions. Please try again later.');
            }
            return res.json();
          }),
        initialData: [],
        retry: false,
      },
    ],
  });

  const renderWorkspaceCards = () => {
    if (results[0].data && results[1].data && results[0].data.length > 0) {
      const cardsData: UserWorkspaceCardProps[] = [];
      for (const workspace of results[0].data) {
        let isMatched = false;
        for (const session of results[1].data) {
          if (session.workspace === workspace.name) {
            isMatched = true;
            const cardData: UserWorkspaceCardProps = {
              cpuUsage: 'CPU',
              memoryUsage: 'MEMORY',
              userWorkspaceCRData: workspace,
              userSessionCRData: session,
              refetch: () => {
                results[0].refetch();
                results[1].refetch();
              },
              numberOfSessions: results[1].data.length,
            };
            cardsData.push(cardData);
            break;
          }
        }
        if (!isMatched) {
          const cardData: UserWorkspaceCardProps = {
            cpuUsage: 'CPU',
            memoryUsage: 'MEMORY',
            userWorkspaceCRData: workspace,
            refetch: () => {
              results[0].refetch();
              results[1].refetch();
            },
            numberOfSessions: results[1].data.length,
          };
          cardsData.push(cardData);
        }
      }
      return cardsData.map((cardData) => (
        <UserWorkspaceCard
          key={cardData.userWorkspaceCRData.name}
          {...cardData}
          refetch={() => {
            results[0].refetch();
            results[1].refetch();
          }}
        />
      ));
    } else if (results[0].isFetching || results[1].isFetching) {
      return (
        <div className='flex h-full w-full items-center justify-center'>
          <CircularProgress />
        </div>
      );
    } else if (results[0].isError || results[1].isError || results[0].isRefetchError || results[1].isRefetchError) {
      return (
        <div className='flex h-full w-full items-center justify-center'>
          <span className='text-gray-400'>There was an error fetching data. Please try again later.</span>
        </div>
      );
    } else {
      return (
        <div className='flex h-full w-full items-center justify-center'>
          <span className='text-lg font-normal text-gray-400'>
            You do not have any workspaces at the moment. You may create one using the button above.
          </span>
        </div>
      );
    }
  };

  return (
    <div className='h-full w-full'>
      <div className='flex h-20 items-center justify-between py-4 px-5 shadow-md drop-shadow-md'>
        <span className='text-xl text-gray-600 '>Workspaces</span>
        <span className='flex flex-wrap justify-end gap-2'>
          <TheiaButton
            text='Create Workspace'
            icon={<PlusIcon />}
            onClick={() => {
              setModalContent({
                function: UserCreateWorkspaceModalContent,
                props: {
                  refresh: () => {
                    results[0].refetch();
                    results[1].refetch();
                  },
                  setIsModalOpen,
                  keycloak,
                },
              });
              setIsModalOpen(true);
            }}
            disabled={results[0].isFetching || results[1].isFetching || userCreateWorkspaceIsFetching}
          />
          <TheiaButton
            className='lg:w-32'
            text={results[0].isFetching || results[1].isFetching || userCreateWorkspaceIsFetching ? '' : 'Refresh'}
            icon={
              <RefreshIcon
                className={`h-6 w-6 ${
                  (results[0].isFetching || results[1].isFetching || userCreateWorkspaceIsFetching) && 'animate-spin'
                }`}
              />
            }
            onClick={() => {
              results[0].refetch();
              results[1].refetch();
            }}
            disabled={results[0].isFetching || results[1].isFetching || userCreateWorkspaceIsFetching}
          />
        </span>
      </div>
      <div
        ref={parent}
        className='flex h-[calc(100vh-5rem)] w-full flex-col gap-6 overflow-y-auto p-5 pb-16'
      >
        {renderWorkspaceCards()}
      </div>
    </div>
  );
};

export default Workspaces;

import { useContext } from 'react';
import RefreshIcon from '../components/icons/RefreshIcon';
import TheiaButton from '../components/TheiaButton';
import UserWorkspaceCard, { UserWorkspaceCardProps } from '../components/UserWorkspaceCard';
import { Context } from '../context/Context';
import CircularProgress from '@mui/material/CircularProgress';
import PlusIcon from '../components/icons/PlusIcon';
import { useQueries, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const Workspaces = () => {
  const { keycloak } = useContext(Context);
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 100,
    easing: 'ease-in-out',
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ['user/workspaces'],
        queryFn: () =>
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
        initialData: undefined,
        retry: false,
      },
      {
        queryKey: ['user/sessions'],
        queryFn: () =>
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
        initialData: undefined,
        retry: false,
      },
    ],
  });

  const createUserWorkspaceResult = useQuery({
    queryKey: ['user/createWorkspace'],
    queryFn: () =>
      fetch('/api/user/workspaces', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ appDefinition: 'theia-cloud-demo' }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error creating workspace. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      results[0].refetch();
      results[1].refetch();
    },
    staleTime: Infinity,
    retry: false,
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
    } else if (results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching) {
      return (
        <div className='flex justify-center items-center w-full h-full'>
          <CircularProgress />
        </div>
      );
    } else if (results[0].isError || results[1].isError || results[0].isRefetchError || results[1].isRefetchError) {
      return (
        <div className='flex justify-center items-center w-full h-full'>
          <span className='text-gray-400'>There was an error fetching data. Please try again later.</span>
        </div>
      );
    } else {
      return (
        <div className='flex justify-center items-center w-full h-full'>
          <span className='text-gray-400 text-lg font-normal'>
            You do not have any workspaces at the moment. You may create one using the button above.
          </span>
        </div>
      );
    }
  };

  return (
    <div className='w-full h-full'>
      <div className='flex py-4 px-5 shadow-sm h-20 items-center justify-between'>
        <span className='text-xl text-gray-600 '>Workspaces</span>
        <span className='flex gap-2 flex-wrap justify-end'>
          <TheiaButton
            text='Create Workspace'
            icon={<PlusIcon />}
            onClick={() => {
              createUserWorkspaceResult.refetch();
            }}
            disabled={results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching}
          />
          <TheiaButton
            className='lg:w-32'
            text={
              results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching ? '' : 'Refresh'
            }
            icon={
              <RefreshIcon
                className={`w-6 h-6 ${
                  (results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching) &&
                  'animate-spin'
                }`}
              />
            }
            onClick={() => {
              results[0].refetch();
              results[1].refetch();
            }}
            disabled={results[0].isFetching || results[1].isFetching || createUserWorkspaceResult.isFetching}
          />
        </span>
      </div>
      <div
        ref={parent}
        className='flex p-5 w-full h-[calc(100vh-4rem)] flex-col gap-6'
      >
        {renderWorkspaceCards()}
      </div>
    </div>
  );
};

export default Workspaces;

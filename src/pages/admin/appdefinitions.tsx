import { useContext } from 'react';
import RefreshIcon from '../../components/icons/RefreshIcon';
import TheiaButton from '../../components/TheiaButton';
import AdminAppDefCard, { AdminAppDefCardProps } from '../../components/AdminAppDefinitionCard';
import { Context } from '../../context/Context';
import CircularProgress from '@mui/material/CircularProgress';
import PlusIcon from '../../components/icons/PlusIcon';
import { useQueries, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { UserSessionCRData } from '../../../types/UserSessionCRData';

const AppDefinitions = () => {
  const { keycloak } = useContext(Context);
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 100,
    easing: 'ease-in-out',
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ['admin/appdefinitions'],
        queryFn: async (): Promise<UserSessionCRData[]> =>
          fetch('/api/admin/appdefinitions', {
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
    if (results[0]) {
      const cardsData: AdminAppDefCardProps[] = [];
      
      return cardsData.map((cardData) => (
        <AdminAppDefCard
          key={cardData.name}
          {...cardData}
          refetch={() => {
            results[0].refetch();
          }}
        />
      ));
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
        <span className='text-xl text-gray-600 '>App Definitions</span>
        <span className='flex gap-2 flex-wrap justify-end'>
          <TheiaButton
            text='Create Workspace'
            icon={<PlusIcon />}
            onClick={() => {
              
            }}
            disabled={results[0].isFetching }
          />
          <TheiaButton
            className='lg:w-32'
            text={
              results[0].isFetching ? '' : 'Refresh'
            }
            icon={
              <RefreshIcon
                className={`w-6 h-6 ${
                  (results[0].isFetching) &&
                  'animate-spin'
                }`}
              />
            }
            onClick={() => {
              results[0].refetch();
            }}
            disabled={results[0].isFetching }
          />
        </span>
      </div>
      <div
        ref={parent}
        className='flex p-5 w-full h-[calc(100vh-5rem)] flex-col gap-6'
      >
        {renderWorkspaceCards()}
      </div>
    </div>
  );
};

export default AppDefinitions;

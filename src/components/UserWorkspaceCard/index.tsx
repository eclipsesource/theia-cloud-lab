import { useContext, useState } from 'react';
import AdditionalOptionsContainer from './AdditionalOptionsContainer';
import NewTabIcon from '../icons/NewTabIcon';
import OptionsIcon from '../icons/OptionsIcon';
import OutsideClickHandler from '../OutsideClickHandler';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { UserWorkspaceCRData } from '../../../types/UserWorkspaceCRData';
import { UserSessionCRData } from '../../../types/UserSessionCRData';
import { useQuery } from '@tanstack/react-query';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { dividerClasses } from '@mui/material';

export type UserWorkspaceCardProps = {
  cpuUsage: 'CPU';
  memoryUsage: 'MEMORY';
  userWorkspaceCRData: UserWorkspaceCRData;
  userSessionCRData?: UserSessionCRData;
  refetch: () => void;
};

export default function UserWorkspaceCard(props: UserWorkspaceCardProps) {
  const { keycloak } = useContext(Context);
  const [isOptionsShown, setIsOptionsShown] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 100,
    easing: 'ease-in-out',
  });

  const deleteUserWorkspaceResult = useQuery({
    queryKey: [`user/deleteWorkspace/${props.userWorkspaceCRData.name}}`],
    queryFn: () =>
      fetch('/api/user/workspaces', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({ toBeDeletedWorkspaces: [props.userWorkspaceCRData.name] }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error deleting workspace. Please try again later.');
        }
        return res;
      }),
    enabled: false,
    onSettled: () => {
      props.refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  const restartUserWorkspaceResult = useQuery({
    queryKey: [`user/restartWorkspace/${props.userWorkspaceCRData.name}}`],
    queryFn: () =>
      fetch('/api/user/sessions', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ appDefinition: 'theia-cloud-demo', workspaceName: props.userWorkspaceCRData.name }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error restarting workspace. Please try again later.');
        }
        return res;
      }),
    enabled: false,
    onSettled: () => {
      props.refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  const stopUserWorkspaceResult = useQuery({
    queryKey: [`user/stopWorkspace/${props.userWorkspaceCRData.name}}`],
    queryFn: () =>
      fetch('/api/user/sessions', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({ sessionName: props.userSessionCRData?.name }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error stopping workspace. Please try again later.');
        }
        return res;
      }),
    enabled: false,
    onSettled: () => {
      props.refetch();
    },
    staleTime: Infinity,
    retry: false,
  });

  return (
    <div className='flex flex-col p-4 w-full shadow-lg rounded-lg bg-gray-100 justify-between whitespace-pre-wrap hover:shadow-xl relative'>
      {(stopUserWorkspaceResult.isFetching ||
        deleteUserWorkspaceResult.isFetching ||
        restartUserWorkspaceResult.isFetching) && (
        <div className='absolute z-50 bg-gray-100 bg-opacity-75 w-full h-full top-0 left-0 rounded-lg'></div>
      )}
      <div className='flex justify-between'>
        {props.userSessionCRData ? (
          <a
            href={'//' + props.userSessionCRData.url + '/'}
            target='_blank'
            className='flex text-lg cursor-pointer font-medium h-fit w-fit hover:underline text-blue-500 items-center'
            rel='noreferrer'
          >
            {props.userWorkspaceCRData.name} <NewTabIcon className='w-5 h-5' />
          </a>
        ) : (
          <span className='text-lg font-medium'>{props.userWorkspaceCRData.name}</span>
        )}
        <OutsideClickHandler onClickOutside={() => setIsOptionsShown(false)}>
          <div
            ref={parent}
            className='relative'
          >
            <button
              onClick={() => setIsOptionsShown(!isOptionsShown)}
              disabled={
                stopUserWorkspaceResult.isFetching ||
                deleteUserWorkspaceResult.isFetching ||
                restartUserWorkspaceResult.isFetching
              }
            >
              <OptionsIcon
                className={`w-7 h-7 rounded-full hover:bg-black hover:stroke-white ${
                  (stopUserWorkspaceResult.isFetching ||
                    deleteUserWorkspaceResult.isFetching ||
                    restartUserWorkspaceResult.isFetching) &&
                  'animate-spin'
                }`}
              />
            </button>
            {isOptionsShown &&
              (props.userSessionCRData ? (
                <AdditionalOptionsContainer
                  isRunning={true}
                  stopUserWorkspace={() => stopUserWorkspaceResult.refetch()}
                  closeAdditionalOptions={() => setIsOptionsShown(false)}
                />
              ) : (
                <AdditionalOptionsContainer
                  isRunning={false}
                  deleteUserWorkspace={() => deleteUserWorkspaceResult.refetch()}
                  restartUserWorkspace={() => restartUserWorkspaceResult.refetch()}
                  closeAdditionalOptions={() => setIsOptionsShown(false)}
                />
              ))}
          </div>
        </OutsideClickHandler>
      </div>
      <div className='flex flex-col flex-wrap justify-between'>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>App Definition: </span>
          {props.userWorkspaceCRData.appDefinition}
        </div>
        {props.userSessionCRData && (
          <div className='flex w-1/2 justify-end self-end'>
            <div className='w-fit mt-1 mb-1 mr-2 text-sm'>
              <span className='font-medium'>Memory Usage: </span>
              <span>{props.memoryUsage}</span>
            </div>
            <div className='w-fit mt-1 mb-1 text-sm'>
              <span className='font-medium'>CPU Usage: </span>
              <span>{props.cpuUsage}</span>
            </div>
          </div>
        )}
        <div className={'mt-1 mb-1 inline-flex justify-between'}>
          <div className={props.userSessionCRData ? 'text-green-500' : 'text-red-500'}>
            <span className='font-medium'>Status:</span> {props.userSessionCRData ? 'Running' : 'Stopped'}
          </div>
          <div>
            {props.userSessionCRData && (
              <span>
                <span className='font-medium'>Last Activity:</span>{' '}
                {dayjs(props.userSessionCRData.lastActivity).toString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

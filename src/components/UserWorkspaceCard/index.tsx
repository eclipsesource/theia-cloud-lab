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

export type UserWorkspaceCardProps = {
  status: 'Running' | 'Stopped';
  lastActivity: string;
  name: string;
  appDefinition: string;
  url: string;
  cpuUsage: string;
  memoryUsage: string;
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
    queryKey: ['user/deleteWorkspace'],
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
    queryKey: ['user/restartWorkspace'],
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
    queryKey: ['user/stopWorkspace'],
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
    <div className='flex flex-col p-4 w-full shadow-lg rounded-lg bg-gray-100 justify-between whitespace-pre-wrap hover:shadow-xl'>
      <div className='flex justify-between'>
        {props.status === 'Running' ? (
          <a
            href={'//' + props.url + '/'}
            target='_blank'
            className='flex text-lg cursor-pointer font-medium h-fit w-fit hover:underline text-blue-500 items-center'
            rel='noreferrer'
          >
            {props.name} <NewTabIcon className='w-5 h-5' />
          </a>
        ) : (
          <span className='text-lg font-medium'>{props.name}</span>
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
              <OptionsIcon className='w-7 h-7 rounded-full hover:bg-black hover:stroke-white' />
            </button>
            {isOptionsShown &&
              (props.status === 'Running' ? (
                <AdditionalOptionsContainer
                  status={props.status}
                  stopUserWorkspace={() => stopUserWorkspaceResult.refetch()}
                  closeAdditionalOptions={() => setIsOptionsShown(false)}
                />
              ) : (
                <AdditionalOptionsContainer
                  status={props.status}
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
          {props.appDefinition}
        </div>
        {props.status === 'Running' && (
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
          <div className={props.status === 'Running' ? 'text-green-500' : 'text-red-500'}>
            <span className='font-medium'>Status:</span> {props.status}
          </div>
          <div>
            {props.status === 'Running' && (
              <span>
                <span className='font-medium'>Last Activity:</span> {props.lastActivity}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Dispatch, memo, SetStateAction, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MenuItem, TextField } from '@mui/material';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import { Context } from '../../context/Context';
import Keycloak from 'keycloak-js';
import CheckIcon from '../icons/CheckIcon';
import { UserSessionCRData } from '../../../types/UserSessionCRData';
import dayjs from 'dayjs';
import ExclamationIcon from '../icons/ExclamationIcon';

export type UserSwitchWorkspaceModalContentProps = {
  refresh: () => void;
  keycloak: Keycloak;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  workspaceName: string;
  appDefinition: string;
};

const UserSwitchWorkspaceModalContent = (props: UserSwitchWorkspaceModalContentProps) => {
  const { setUserCreateWorkspaceIsFetching, setUserSwitchWorkspaceFromTo, setModalContent } = useContext(Context);
  const [selectedSessionToBeDeleted, setSelectedSessionToBeDeleted] = useState('');

  const queryUserSessions = useQuery({
    queryKey: ['user/sessions'],
    queryFn: async (): Promise<UserSessionCRData[]> =>
      fetch('/api/user/sessions', {
        headers: {
          Authorization: `Bearer ${props.keycloak.token}`,
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
  });

  const querySwitchUserSession = useQuery({
    queryKey: ['user/switchUserSession'],
    queryFn: () =>
      fetch('/api/user/sessions', {
        headers: {
          Authorization: `Bearer ${props.keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          switch: true,
          appDefinition: props.appDefinition,
          sessionName: selectedSessionToBeDeleted,
          workspaceName: props.workspaceName,
        }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error switching active workspaces. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      props.refresh();
      setUserSwitchWorkspaceFromTo(['', '']);
      setModalContent({
        function: () => <></>,
        props: { setIsModalOpen: () => {} },
      });
    },
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    setUserCreateWorkspaceIsFetching(querySwitchUserSession.isFetching || queryUserSessions.isFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySwitchUserSession.isFetching, queryUserSessions.isFetching]);

  return (
    <div className='w-full h-full flex flex-col gap-10 items-center'>
      <ExclamationIcon className='w-16 h-16' />
      <div className='w-full font-normal'>
        <div>
          You can only have 2 active workspaces at the same time. If you want to switch to another workspace, you need
          to stop one.
        </div>
      </div>
      <div className='w-full flex items-center'>
        <span className='font-bold mr-5'>Workspace to be stopped:</span>
        <TextField
          id='appDefinition-select'
          select
          InputLabelProps={{
            shrink: true,
          }}
          value={selectedSessionToBeDeleted}
          style={{ width: 400 }}
          onChange={(e) => {
            setSelectedSessionToBeDeleted(e.target.value);
          }}
          defaultValue={queryUserSessions.data.length > 0 ? queryUserSessions.data[0].name : ''}
          size='small'
        >
          {queryUserSessions.data.map((option) => (
            <MenuItem
              key={option.name}
              value={option.name}
            >
              {option.name + ' - ' + dayjs(option.lastActivity).toString()}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className='flex justify-between w-full'>
        <TheiaButton
          text='Cancel'
          icon={<CancelIcon />}
          onClick={() => {
            props.setIsModalOpen(false);
            setModalContent({
              function: () => <></>,
              props: { setIsModalOpen: () => {} },
            });
          }}
        />
        <TheiaButton
          className='bg-green-500 hover:bg-green-700'
          text='Switch Workspace'
          icon={<CheckIcon />}
          onClick={() => {
            for (const session of queryUserSessions.data) {
              if (session.name === selectedSessionToBeDeleted) {
                setUserSwitchWorkspaceFromTo([session.workspace, props.workspaceName]);
                break;
              }
            }
            querySwitchUserSession.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default UserSwitchWorkspaceModalContent;

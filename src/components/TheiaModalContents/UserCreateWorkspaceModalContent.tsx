import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MenuItem, TextField } from '@mui/material';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import { Context } from '../../context/Context';
import Keycloak from 'keycloak-js';
import CheckIcon from '../icons/CheckIcon';

export type UserCreateWorkspaceModalContentProps = {
  refresh: () => void;
  keycloak: Keycloak;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const UserCreateWorkspaceModalContent = (props: UserCreateWorkspaceModalContentProps) => {
  const { setUserCreateWorkspaceIsFetching } = useContext(Context);
  const [selectedAppDefinition, setSelectedAppDefinition] = useState('');

  const createUserWorkspaceResult = useQuery({
    queryKey: ['user/createWorkspace'],
    queryFn: () =>
      fetch('/api/user/workspaces', {
        headers: {
          Authorization: `Bearer ${props.keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ appDefinition: selectedAppDefinition }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error creating workspace. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      props.refresh();
    },
    staleTime: Infinity,
    retry: false,
  });

  const fetchAppDefinitions = useQuery({
    queryKey: ['user/appDefinitions'],
    queryFn: async (): Promise<{ value: string; label: string }[]> =>
      fetch('/api/user/appDefinitions', {
        headers: {
          Authorization: `Bearer ${props.keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error fetching app definitions. Please try again later.');
        }
        return res.json();
      }),
    initialData: [],
    retry: false,
  });

  useEffect(() => {
    setUserCreateWorkspaceIsFetching(createUserWorkspaceResult.isFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserWorkspaceResult.isFetching]);

  return (
    <div className='w-full h-full flex flex-col gap-10 items-center'>
      <div className='w-full flex items-center'>
        <span className='font-bold mr-5'>App Definition:</span>
        <TextField
          id='appDefinition-select'
          select
          InputLabelProps={{
            shrink: true,
          }}
          value={selectedAppDefinition}
          style={{ width: 200 }}
          onChange={(e) => setSelectedAppDefinition(e.target.value)}
          defaultValue={fetchAppDefinitions.data.length > 0 ? fetchAppDefinitions.data[0].value : ''}
          size='small'
        >
          {fetchAppDefinitions.data.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
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
          }}
        />
        <TheiaButton
          className='bg-green-500 hover:bg-green-700'
          text='Create Workspace'
          icon={<CheckIcon />}
          onClick={() => {
            createUserWorkspaceResult.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default UserCreateWorkspaceModalContent;
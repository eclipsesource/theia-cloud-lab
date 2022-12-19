import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import { Context } from '../../context/Context';
import Keycloak from 'keycloak-js';
import CheckIcon from '../icons/CheckIcon';

export type AdminCreateWorkspaceModalContentProps = {
  refresh: () => void;
  keycloak: Keycloak;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminCreateWorkspaceModalContent = (props: AdminCreateWorkspaceModalContentProps) => {
  const { setAdminCreateWorkspaceIsFetching } = useContext(Context);
  const [userId, setUserId] = useState('');

  const createWorkspacesResult = useQuery({
    queryKey: ['admin/createWorkspaces'],
    queryFn: () =>
      fetch('/api/admin/workspaces/cr', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({ userId: userId, appDefinition: 'theia-cloud-demo' }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error creating workspaces. Please try again later.');
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

  useEffect(() => {
    setAdminCreateWorkspaceIsFetching(createWorkspacesResult.isFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createWorkspacesResult.isFetching]);

  return (
    <div className='w-full h-full flex flex-col gap-5 items-center'>
      <div className='w-full font-normal'>
        <TextField
          label='User ID'
          variant='outlined'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
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
            createWorkspacesResult.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AdminCreateWorkspaceModalContent;

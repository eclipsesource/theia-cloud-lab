import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import { Context } from '../../context/Context';
import Keycloak from 'keycloak-js';
import CheckIcon from '../icons/CheckIcon';

export type AdminCreateApDefinitionModalContentProps = {
  refresh: () => void;
  keycloak: Keycloak;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminCreateAppDefinitionModalContent = (props: AdminCreateApDefinitionModalContentProps) => {
  const { setAdminCreateWorkspaceIsFetching: setAdminCreateAppDefinitionIsFetching, setModalContent } =
    useContext(Context);
  const [appDefName, setAppDefName] = useState('');
  const [appDefImage, setAppDefImage] = useState('');

  const createWorkspacesResult = useQuery({
    queryKey: ['admin/createAppDefinition'],
    queryFn: () =>
      fetch('/api/admin/appDefinitions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({ name: appDefName, image: appDefImage }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error creating workspaces. Please try again later.');
        }
        return res.json();
      }),
    enabled: false,
    onSettled() {
      props.refresh();
      setModalContent({
        function: () => <></>,
        props: { setIsModalOpen: () => {} },
      });
    },
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    setAdminCreateAppDefinitionIsFetching(createWorkspacesResult.isFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createWorkspacesResult.isFetching]);

  return (
    <div className='flex h-full w-full flex-col items-center gap-10'>
      <div className='flex h-full w-full flex-col justify-center gap-3'>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>App Definition Name:</span>
          <TextField
            variant='outlined'
            value={appDefName}
            onChange={(e) => setAppDefName(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='Example Name'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>App Definition Image:</span>
          <TextField
            variant='outlined'
            value={appDefImage}
            onChange={(e) => setAppDefImage(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='Example Image'
          />
        </div>
      </div>
      <div className='flex w-full justify-between'>
        <TheiaButton
          text='Cancel'
          icon={<CancelIcon />}
          onClick={() => {
            props.setIsModalOpen(false);
          }}
        />
        <TheiaButton
          className='bg-green-500 hover:bg-green-700'
          text='Create AppDefinition'
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

export default AdminCreateAppDefinitionModalContent;

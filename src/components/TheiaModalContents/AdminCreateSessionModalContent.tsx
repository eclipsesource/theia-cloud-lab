import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import { Context } from '../../context/Context';
import Keycloak from 'keycloak-js';
import CheckIcon from '../icons/CheckIcon';
import InfoIcon from '../icons/InfoIcon';

export type AdminCreateSessionModalContentProps = {
  refresh: () => void;
  keycloak: Keycloak;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminCreateSessionModalContent = (props: AdminCreateSessionModalContentProps) => {
  const { setAdminCreateSessionIsFetching } = useContext(Context);
  const [userId, setUserId] = useState('');

  const createSessionResult = useQuery({
    queryKey: ['admin/createSession'],
    queryFn: () =>
      fetch('/api/admin/sessions/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({ userId: userId, appDefinition: 'theia-cloud-demo' }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error creating session. Please try again later.');
        }
        return res;
      }),
    enabled: false,
    onSettled() {
      props.refresh();
    },
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    setAdminCreateSessionIsFetching(createSessionResult.isFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSessionResult.isFetching]);

  return (
    <div className='w-full h-full flex flex-col gap-5 items-center'>
      <InfoIcon className='w-16 h-16' />
      <div className='w-full font-normal'>
        <div className='font-normal mb-4'> Please provide an email to be further assigned to a user session.</div>
        <TextField
          label='User Email'
          variant='outlined'
          size='small'
          value={userId}
          style={{ width: 250 }}
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
          text='Create Session'
          icon={<CheckIcon />}
          onClick={() => {
            createSessionResult.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AdminCreateSessionModalContent;

import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MenuItem, TextField } from '@mui/material';
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
  const [selectedAppDefinition, setSelectedAppDefinition] = useState('');

  const fetchAppDefinitions = useQuery({
    queryKey: ['admin/appDefinitions'],
    queryFn: async (): Promise<{ value: string; label: string }[]> =>
      fetch('/api/admin/appDefinitions', {
        headers: {
          Authorization: `Bearer ${props.keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error fetching App Definitions. Please try again later.');
        }
        return res.json();
      }),
    initialData: [],
    retry: false,
  });

  const createSessionResult = useQuery({
    queryKey: ['admin/createSession'],
    queryFn: () =>
      fetch('/api/admin/sessions/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.keycloak.token}`,
        },
        method: 'POST',
        body: JSON.stringify({ userId: userId, appDefinition: selectedAppDefinition }),
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
    <div className='w-full h-full flex flex-col gap-10 items-center'>
      <div className='w-full h-full flex flex-col gap-3 justify-center'>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>User ID:</span>
          <TextField
            variant='outlined'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>App Definition:</span>
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

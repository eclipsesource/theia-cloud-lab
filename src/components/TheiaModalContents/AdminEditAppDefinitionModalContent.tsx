import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MenuItem, TextField } from '@mui/material';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import { Context } from '../../context/Context';
import Keycloak from 'keycloak-js';
import CheckIcon from '../icons/CheckIcon';
import { AdminAppDefinitionCRData } from '../../../types/AdminAppDefinitionCRData';

export type AdminEditApDefinitionModalContentProps = {
  adminAppDefinitionCRData: AdminAppDefinitionCRData;
  refresh: () => void;
  keycloak: Keycloak;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
};

const AdminEditAppDefinitionModalContent = (props: AdminEditApDefinitionModalContentProps) => {
  const { setAdminCreateWorkspaceIsFetching: setAdminEditAppDefinitionIsFetching } = useContext(Context);
  const [appDefName, setAppDefName] = useState('');
  const [appDefImage, setAppDefImage] = useState('');
  const [appDefCPULimit, setAppDefCPULimit] = useState('');
  const [appDefCPURequest, setAppDefCPURequest] = useState('');
  const [appDefMemoryLimits, setAppappDefMemoryLimits] = useState('');
  const [appDefMemoryRequests, setAppDefappDefMemoryRequests] = useState('');
  const [appDefPort, setAppDefPort] = useState('');
  const [appDefTimeout, setAppDefTimeout] = useState('');
  const [appDefMaxInstance, setAppDefMaxInstance] = useState('');
  const [appDefMinInstance, setAppDefMinInstance] = useState('');

  /*const editAdminAppDefinitionResult = useQuery({
    queryKey: [`admin/appDefinitions/"coffee-editor"`], //${props.adminAppDefinitionCRData.name}
    queryFn: () =>
      fetch('/api/admin/appDefinitions', {
        headers: {
          Authorization: `Bearer ${props.keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ appDefinition: props.adminAppDefinitionCRData.name }), //
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error restarting app definitions. Please try again later.');
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

  useEffect(() => {
    setAdminEditAppDefinitionIsFetching(editAdminAppDefinitionResult.isFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAdminAppDefinitionResult.isFetching]);*/

  return (
    <div className='flex h-full w-full flex-col items-center gap-10'>
      <div className='flex h-full w-full flex-col justify-center gap-3'>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>App Definition Name:</span>
          <TextField
            variant='outlined'
            value={appDefName}
            //onChange={(e) => setAppDefName(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
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
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>CPU Limits:</span>
          <TextField
            variant='outlined'
            value={appDefCPULimit}
            onChange={(e) => setAppDefCPULimit(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>CPU Requests:</span>
          <TextField
            variant='outlined'
            value={appDefCPURequest}
            onChange={(e) => setAppDefCPURequest(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>Memory Limits:</span>
          <TextField
            variant='outlined'
            value={appDefMemoryLimits}
            onChange={(e) => setAppappDefMemoryLimits(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>Memory Requests:</span>
          <TextField
            variant='outlined'
            value={appDefMemoryRequests}
            onChange={(e) => setAppDefappDefMemoryRequests(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>Port:</span>
          <TextField
            variant='outlined'
            value={appDefPort}
            onChange={(e) => setAppDefPort(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>Timeout:</span>
          <TextField
            variant='outlined'
            value={appDefTimeout}
            onChange={(e) => setAppDefTimeout(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>Max Instances:</span>
          <TextField
            variant='outlined'
            value={appDefMaxInstance}
            onChange={(e) => setAppDefMaxInstance(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
          />
        </div>
        <div className='flex w-full items-center'>
          <span className='mr-5 w-32 font-bold'>Min Instances:</span>
          <TextField
            variant='outlined'
            value={appDefMinInstance}
            onChange={(e) => setAppDefMinInstance(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            placeholder='johndoe@example.com'
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
          text='Edit AppDefinition'
          icon={<CheckIcon />}
          onClick={() => {
            props.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AdminEditAppDefinitionModalContent;

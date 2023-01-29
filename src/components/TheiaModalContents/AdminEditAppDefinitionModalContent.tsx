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
  const {setAdminCreateWorkspaceIsFetching: setAdminEditAppDefinitionIsFetching } = useContext(Context);
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
    <div className='w-full h-full flex flex-col gap-10 items-center'>
      <div className='w-full h-full flex flex-col gap-3 justify-center'>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>App Definition Name:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>App Definition Image:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>CPU Limits:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>CPU Requests:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Memory Limits:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Memory Requests:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Port:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Timeout:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Max Instances:</span>
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
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Min Instances:</span>
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

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
  const [appDefName, setAppDefName] = useState(props.adminAppDefinitionCRData.name);
  const [appDefImage, setAppDefImage] = useState(props.adminAppDefinitionCRData.image);
  const [appDefCPULimit, setAppDefCPULimit] = useState(props.adminAppDefinitionCRData.limitsCpu);
  const [appDefCPURequest, setAppDefCPURequest] = useState(props.adminAppDefinitionCRData.requestsCpu);
  const [appDefMemoryLimits, setAppDefMemoryLimits] = useState(props.adminAppDefinitionCRData.limitsMemory);
  const [appDefMemoryRequests, setAppDefMemoryRequests] = useState(props.adminAppDefinitionCRData.requestsMemory);
  const [appDefPort, setAppDefPort] = useState(String(props.adminAppDefinitionCRData.port));
  const [appDefTimeout, setAppDefTimeout] = useState(String(props.adminAppDefinitionCRData.timeout));
  const [appDefMaxInstance, setAppDefMaxInstance] = useState(props.adminAppDefinitionCRData.maxInstances);
  const [appDefMinInstance, setAppDefMinInstance] = useState(props.adminAppDefinitionCRData.minInstances);

  const editAdminAppDefinitionResult = useQuery({
    queryKey: [`admin/appDefinitions/edit/${props.adminAppDefinitionCRData.name}`],
    queryFn: () =>
      fetch('/api/admin/appDefinitions', {
        headers: {
          Authorization: `Bearer ${props.keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          name: appDefName,
          image: appDefImage,
          port: appDefPort,
          requestsCPU: appDefCPURequest,
          requestsMemory: appDefMemoryRequests,
          limitsMemory: appDefMemoryLimits,
          limitsCpu: appDefCPULimit,
          timeout: appDefTimeout,
        }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error restarting app definitions. Please try again later.');
        }
        return res;
      }),
    enabled: false,
    onSettled: () => {
      props.setIsModalOpen(false);
    },
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    setAdminEditAppDefinitionIsFetching(editAdminAppDefinitionResult.isFetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAdminAppDefinitionResult.isFetching]);

  return (
    <div className='w-full h-full flex flex-col gap-10 items-center'>
      <div className='w-full h-full flex flex-col gap-3 justify-center'>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>App Definition Name:</span>
          <TextField
            variant='outlined'
            value={appDefName}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
            disabled
          />
        </div>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>App Definition Image:</span>
          <TextField
            variant='outlined'
            value={appDefImage}
            onChange={(e) => setAppDefImage(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
          />
        </div>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>CPU Limits:</span>
          <TextField
            variant='outlined'
            value={appDefCPULimit}
            onChange={(e) => setAppDefCPULimit(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
          />
        </div>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>CPU Requests:</span>
          <TextField
            variant='outlined'
            value={appDefCPURequest}
            onChange={(e) => setAppDefCPURequest(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
          />
        </div>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Memory Limits:</span>
          <TextField
            variant='outlined'
            value={appDefMemoryLimits}
            onChange={(e) => setAppDefMemoryLimits(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
          />
        </div>
        <div className='w-full flex items-center'>
          <span className='font-bold mr-5 w-32'>Memory Requests:</span>
          <TextField
            variant='outlined'
            value={appDefMemoryRequests}
            onChange={(e) => setAppDefMemoryRequests(e.target.value)} // ?
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: 200 }}
            size='small'
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
            console.log('edit app def', {
              name: appDefName,
              image: appDefImage,
              port: appDefPort,
              requestsCPU: appDefCPURequest,
              requestsMemory: appDefMemoryRequests,
              limitsMemory: appDefMemoryLimits,
              limitsCpu: appDefCPULimit,
              timeout: appDefTimeout,
              action: 'update',
            });
            editAdminAppDefinitionResult.refetch();
          }}
        />
      </div>
    </div>
  );
};

export default AdminEditAppDefinitionModalContent;

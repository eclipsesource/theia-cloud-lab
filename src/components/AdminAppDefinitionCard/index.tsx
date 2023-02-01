'use client';

import { useContext, useState } from 'react';
import OptionsIcon from '../icons/OptionsIcon';
import OutsideClickHandler from '../OutsideClickHandler';
import AdditionalOptionsContainer from './AdditionalOptionsContainer';
import { AdminAppDefinitionCRData } from '../../../types/AdminAppDefinitionCRData';
import { useQuery } from '@tanstack/react-query';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';

export type AdminAppDefinitionCardProps = {
  adminAppDefinitionCRData: AdminAppDefinitionCRData;
  //adminSessionCRData: AdminSessionCRData;
  refetch: () => void;
};

export default function AdminAppDefinitionCard(props: AdminAppDefinitionCardProps) {
  const { keycloak } = useContext(Context);
  const [isOptionsShown, setIsOptionsShown] = useState(false);

  const deleteAdminAppDefinitionResult = useQuery({
    queryKey: [`admin/appDefinitions/delete/${props.adminAppDefinitionCRData.name}}`],
    queryFn: () =>
      fetch('/api/admin/appDefinitions', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({ toBeDeletedAppDefinition: props.adminAppDefinitionCRData.name }),
      }).then((res) => {
        if (!res.ok) {
          toast.error('There was an error deleting app definitions. Please try again later.');
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
    <div className='relative flex w-full flex-col justify-between whitespace-pre-wrap rounded-lg bg-gray-100 p-4 shadow-lg hover:shadow-xl'>
      {deleteAdminAppDefinitionResult.isFetching && (
        <div className='absolute top-0 left-0 z-50 h-full w-full rounded-lg bg-gray-100 bg-opacity-75'></div>
      )}
      <div className='flex justify-between'>
        <span className='text-lg font-medium'>{props.adminAppDefinitionCRData.name}</span>

        <OutsideClickHandler onClickOutside={() => setIsOptionsShown(false)}>
          <div className='relative'>
            <button
              onClick={() => setIsOptionsShown(!isOptionsShown)}
              disabled={deleteAdminAppDefinitionResult.isFetching}
            >
              <OptionsIcon
                className={`h-7 w-7 rounded-full hover:bg-black hover:stroke-white ${
                  deleteAdminAppDefinitionResult.isFetching && 'animate-spin'
                }`}
              />
            </button>
            {isOptionsShown && (
              <AdditionalOptionsContainer
                deleteAppDefinition={() => deleteAdminAppDefinitionResult.refetch()}
                closeAdditionalOptions={() => setIsOptionsShown(false)}
                adminAppDefinitionCRData={props.adminAppDefinitionCRData}
                refresh={() => props.refetch()}
              />
            )}
          </div>
        </OutsideClickHandler>
      </div>
      <div className='flex flex-col flex-wrap justify-between'>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>App Definition: </span>
          {props.adminAppDefinitionCRData.name}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>Image: </span>
          {props.adminAppDefinitionCRData.image}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>CPU Limits: </span>
          {props.adminAppDefinitionCRData.limitsCpu}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>CPU Requests: </span>
          {props.adminAppDefinitionCRData.requestsCpu}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>Memory Limits: </span>
          {props.adminAppDefinitionCRData.limitsMemory}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>Memory Requests: </span>
          {props.adminAppDefinitionCRData.requestsMemory}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>Port: </span>
          {props.adminAppDefinitionCRData.port}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>Timeout: </span>
          {props.adminAppDefinitionCRData.timeout}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>Max Instances: </span>
          {props.adminAppDefinitionCRData.maxInstances}
        </div>
        <div className='mt-1 mb-1 w-fit'>
          <span className='font-medium'>Min Instances: </span>
          {props.adminAppDefinitionCRData.minInstances}
        </div>
        <div className={'mt-1 mb-1 inline-flex justify-between'}></div>
      </div>
    </div>
  );
}

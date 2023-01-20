'use client';

import { useContext, useState } from 'react';
import OptionsIcon from '../icons/OptionsIcon';
import OutsideClickHandler from '../OutsideClickHandler';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import NewTabIcon from '../icons/NewTabIcon';
import AdditionalOptionsContainer from './AdditionalOptionsContainer'
import { AdminSessionCRData } from '../../../types/AdminSessionCRData';
import { AdminAppDefinitionCRData } from '../../../types/AdminAppDefinitionCRData';
import { useQuery } from '@tanstack/react-query';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';

export type AdminAppDefinitionCardProps = {
  adminAppDefinitionCRData: AdminAppDefinitionCRData;
  adminSessionCRData: AdminSessionCRData;

  refetch: () => void;
};

export default function AdminAppDefinitionCard(props: AdminAppDefinitionCardProps) {
  const { keycloak } = useContext(Context);
  const [isOptionsShown, setIsOptionsShown] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 100,
    easing: 'ease-in-out',
  });

  const deleteAdminAppDefinitionResult = useQuery({
    queryKey: [`admin/appDefinitions/${props.adminAppDefinitionCRData.name}}`],
    queryFn: () =>
      fetch('/api/admin/appDefinitions', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({ toBeDeletedAppDefinitions: [props.adminAppDefinitionCRData.name] }),
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

  const editAdminAppDefinitionResult = useQuery({
    queryKey: [`admin/editAppDefinition/${props.adminAppDefinitionCRData.name}}`],
    queryFn: () =>
      fetch('/api/admin/appDefinitions', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ appDefinition: props.adminAppDefinitionCRData.name }),
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

  return (
    <div className='flex flex-col p-4 w-full shadow-lg rounded-lg bg-gray-100 justify-between whitespace-pre-wrap hover:shadow-xl relative'>
      {(editAdminAppDefinitionResult.isFetching || deleteAdminAppDefinitionResult.isFetching) && (
        <div className='absolute z-50 bg-gray-100 bg-opacity-75 w-full h-full top-0 left-0 rounded-lg'></div>
      )}
      <div className='flex justify-between'>
      {props.adminSessionCRData ? (
          <a
            href={'//' + props.adminSessionCRData.url + '/'}
            target='_blank'
            className='flex text-lg cursor-pointer font-medium h-fit w-fit hover:underline text-blue-500 items-center'
            rel='noreferrer'
          >
            {props.adminAppDefinitionCRData.name} <NewTabIcon className='w-5 h-5' />
          </a>
        ) : (
          <span className='text-lg font-medium'>{props.adminAppDefinitionCRData.name}</span>
        )}
      
        <OutsideClickHandler onClickOutside={() => setIsOptionsShown(false)}>
          <div
            ref={parent}
            className='relative'
          >
            <button
              onClick={() => setIsOptionsShown(!isOptionsShown)}
              disabled={editAdminAppDefinitionResult.isFetching || deleteAdminAppDefinitionResult.isFetching}
            >
              <OptionsIcon
                className={`w-7 h-7 rounded-full hover:bg-black hover:stroke-white ${
                  (editAdminAppDefinitionResult.isFetching || deleteAdminAppDefinitionResult.isFetching) &&
                  'animate-spin'
                }`}
              />
            </button>
            {isOptionsShown &&
              /*(props.adminAppDefinitionCRData ? (
                <AdditionalOptionsContainer
                  isRunning={true}
                  closeAdditionalOptions={() => setIsOptionsShown(false)}
                />
              ) :*/ (
                <AdditionalOptionsContainer
                  isRunning={false}
                  deleteAppDefinition={() => deleteAdminAppDefinitionResult.refetch()}
                  editAppDefinition={() => editAdminAppDefinitionResult.refetch()}
                  closeAdditionalOptions={() => setIsOptionsShown(false)}
                />
              )}
          </div>
        </OutsideClickHandler>
      </div>
      <div className='flex flex-col flex-wrap justify-between'>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>App Definition: </span>
          {props.adminAppDefinitionCRData.name}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Image: </span>
          {props.adminAppDefinitionCRData.image}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>CPU Limits: </span>
          {props.adminAppDefinitionCRData.limitsCpu}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>CPU Requests: </span>
          {props.adminAppDefinitionCRData.requestsCpu}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Memory Limits: </span>
          {props.adminAppDefinitionCRData.limitsMemory}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Memory Requests: </span>
          {props.adminAppDefinitionCRData.requestsMemory}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Port: </span>
          {props.adminAppDefinitionCRData.port}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Timeout: </span>
          {props.adminAppDefinitionCRData.timeout}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Max Instances: </span>
          {props.adminAppDefinitionCRData.maxInstances}
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Min Instances: </span>
          {props.adminAppDefinitionCRData.minInstances}
        </div>
        <div className={'mt-1 mb-1 inline-flex justify-between'}></div>
      </div>
    </div>
  );
}

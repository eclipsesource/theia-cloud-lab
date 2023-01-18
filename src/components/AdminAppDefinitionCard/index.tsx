'use client';

import { useContext, useState } from 'react';
import NewTabIcon from '../icons/NewTabIcon';
import OptionsIcon from '../icons/OptionsIcon';
import OutsideClickHandler from '../OutsideClickHandler';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { UserWorkspaceCRData } from '../../../types/UserWorkspaceCRData';
import { useQuery } from '@tanstack/react-query';
import { Context } from '../../context/Context';
import { toast } from 'react-toastify';

export type AdminAppDefCardProps = {
  port: 'port';
  host: 'host';
  image: 'image';
  name: 'name';
  refetch: () => void;
};

export default function AdminAppDefCard(props: AdminAppDefCardProps) {
  const { keycloak } = useContext(Context);
  const [isOptionsShown, setIsOptionsShown] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 100,
    easing: 'ease-in-out',
  });

  return (
    <div className='flex flex-col p-4 w-full shadow-lg rounded-lg bg-gray-100 justify-between whitespace-pre-wrap hover:shadow-xl relative'>
      <div className='flex justify-between'></div>
      <div className='flex flex-col flex-wrap justify-between'>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Field 1: </span>
        </div>

        <div className={'mt-1 mb-1 inline-flex justify-between'}>
          <div className='text-green-500'>
            <span className='font-medium'>Field 2:</span> XYZ
          </div>
          <div>
            <span>
              <span className='font-medium'>Last Activity:</span>{' '}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

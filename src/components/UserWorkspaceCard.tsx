import { useState } from 'react';
import AdditionalOptions from './AdditionalOptions';
import NewTabIcon from './icons/NewTabIcon';
import OptionsIcon from './icons/OptionsIcon';

export type UserWorkspaceCardProps = {
  status: string;
  lastActivity: string;
  name: string;
  appDefinition: string;
  url: string;
  cpuUsage: string;
  memoryUsage: string;
};

export default function UserWorkspaceCard(props: UserWorkspaceCardProps) {
  const [isOptionsShown, setIsOptionsShown] = useState(false);
  const getStatusClassName = () => {
    const className = props.status === 'Running' ? 'text-green-500' : props.status === 'Stopped' ? 'text-red-500' : '';
    return className;
  };

  return (
    <div className='flex flex-col p-4 w-full shadow-lg rounded-3xl bg-gray-100 justify-between whitespace-pre-wrap'>
      <div className='flex justify-between'>
        {props.status === 'Running' ? (
          <a
            href={'//' + props.url + '/'}
            target='_blank'
            className='flex h-fit w-fit hover:underline hover:text-blue-500'
            rel='noreferrer'
          >
            {props.name + ' '} <NewTabIcon className='w-5 h-5' />
          </a>
        ) : (
          <span>{props.name}</span>
        )}

        <div className='relative'>
          <button onClick={() => setIsOptionsShown(!isOptionsShown)}>
            <OptionsIcon className='w-6 h-6 rounded-full hover:bg-black hover:stroke-white' />
          </button>
          {isOptionsShown ? <AdditionalOptions status={props.status} /> : <></>}
        </div>
      </div>
      <div className='flex flex-col flex-wrap justify-between'>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>App Definition: </span>
          {props.appDefinition}
        </div>

        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>Memory Usage: </span>
          <span>{props.memoryUsage}</span>
        </div>
        <div className='w-fit mt-1 mb-1'>
          <span className='font-medium'>CPU Usage: </span>
          <span>{props.cpuUsage}</span>
        </div>
        <div className={'mt-1 mb-1 inline-flex justify-between'}>
          <div className={getStatusClassName()}>
            <span className='font-medium'>Status:</span> {props.status}
          </div>
          <div>
            <span className='font-medium'>Last Activity:</span> {props.lastActivity}
          </div>
        </div>
      </div>
    </div>
  );
}

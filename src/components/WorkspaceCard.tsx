import { useState } from 'react';
import AdditionalOptions from './AdditionalOptions';
import OptionsIcon from './icons/OptionsIcon';

export type WorkspaceCardProps = {
  status: string;
  lastActivity: string;
  name: string;
  appDefinition: string;
  url: string;
  cpuUsage: string;
  memoryUsage: string;
};

export default function WorkspaceCard(props: WorkspaceCardProps) {
  const [isOptionsShown, setIsOptionsShown] = useState(false);
  return (
    <div className='flex flex-col p-4 w-full h-24 shadow-lg rounded-3xl bg-gray-100 justify-between'>
      <div className='flex justify-between'>
        <a
          href={props.url}
          className='w-1/2'
        >
          {props.name}
        </a>
        <div className='w-1/5'>{props.lastActivity}</div>
        <div className='relative'>
          <button onClick={() => setIsOptionsShown(!isOptionsShown)}>
            <OptionsIcon />
          </button>
          {isOptionsShown ? <AdditionalOptions /> : <></>}
        </div>
      </div>
      <div className='flex justify-between'>
        <div className='w-1/6'>{props.status}</div>
        <div className='w-1/3'>{props.appDefinition}</div>
        <div className='flex justify-between w-1/3'>
          <div className='w-24 flex text-sm gap-1'>
            <span>Memory:</span>
            <span>{props.memoryUsage}</span>
          </div>
          <div className='w-24 flex text-sm gap-1'>
            <span>CPU:</span>
            <span>{props.cpuUsage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

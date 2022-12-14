import { useContext } from 'react';
import DeleteIcon from '../../icons/DeleteIcon';
import RefreshIcon from '../../icons/RefreshIcon';
import StopIcon from '../../icons/StopIcon';
import { UserWorkspaceCardProps } from '../../UserWorkspaceCard';
import AdditionalOptionsItem from './AdditionalOptionsItem';
import { Context } from '../../../context/Context';
import TheiaButton from '../../TheiaButton';
import CancelIcon from '../../icons/CancelIcon';
import ExclamationIcon from '../../icons/ExclamationIcon';

type AdditionalOptionProps = {
  isRunning: boolean;
  deleteUserWorkspace?: () => void;
  restartUserWorkspace?: () => void;
  stopUserWorkspace?: () => void;
  closeAdditionalOptions: () => void;
};

function AdditionalOptions(props: AdditionalOptionProps) {
  const { setModalContent, setIsModalOpen } = useContext(Context);
  return (
    <div className='flex items-center flex-col absolute h-auto w-52 top-0 right-8 z-10 bg-gray-100 shadow-lg rounded-lg border border-black border-solid p-1'>
      {props.isRunning ? (
        <>
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md font-normal'
            text='Stop Workspace'
            onClick={() => {
              props.stopUserWorkspace && props.stopUserWorkspace();
              props.closeAdditionalOptions();
            }}
            icon={<StopIcon className='w-6 h-6' />}
          />
        </>
      ) : (
        <>
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md text-red-500 font-normal'
            text='Delete Workspace'
            onClick={() => {
              setModalContent(
                <div className='w-full h-full flex flex-col gap-5 items-center'>
                  <ExclamationIcon className='w-16 h-16' />
                  <div className='w-full font-normal'>
                    You are trying to delete a workspace. This action cannot be undone. Are you sure?
                  </div>
                  <div className='flex justify-between w-full'>
                    <TheiaButton
                      text='Cancel'
                      icon={<CancelIcon />}
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                    />
                    <TheiaButton
                      className='bg-red-500 hover:bg-red-700'
                      text='Delete Workspace'
                      icon={<DeleteIcon className='w-6 h-6 stroke-white' />}
                      onClick={() => {
                        props.deleteUserWorkspace && props.deleteUserWorkspace();
                        setIsModalOpen(false);
                      }}
                    />
                  </div>
                </div>
              );
              setIsModalOpen(true);
              props.closeAdditionalOptions();
            }}
            icon={<DeleteIcon className='w-6 h-6 stroke-red-500' />}
          />
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md font-normal'
            text='Restart Workspace'
            onClick={() => {
              props.restartUserWorkspace && props.restartUserWorkspace();
              props.closeAdditionalOptions();
            }}
            icon={<RefreshIcon className='w-6 h-6' />}
          />
        </>
      )}
    </div>
  );
}

export default AdditionalOptions;

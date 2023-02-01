import { useContext } from 'react';
import DeleteIcon from '../../icons/DeleteIcon';
import RefreshIcon from '../../icons/RefreshIcon';
import StopIcon from '../../icons/StopIcon';
import AdditionalOptionsItem from './AdditionalOptionsItem';
import { Context } from '../../../context/Context';
import UserDeleteWorkspaceModalContent from '../../TheiaModalContents/UserDeleteWorkspaceModalContent';

type AdditionalOptionProps = {
  isRunning: boolean;
  deleteUserWorkspace?: () => void;
  restartUserWorkspace?: () => void;
  stopUserWorkspace?: () => void;
  closeAdditionalOptions: () => void;
};

function AdditionalOptions(props: AdditionalOptionProps) {
  const { setModalContent, setIsModalOpen, userCreateWorkspaceIsFetching } = useContext(Context);

  return (
    <div className='absolute top-0 right-8 z-10 flex h-auto w-52 flex-col items-center rounded-lg border border-solid border-black bg-gray-100 p-1 shadow-lg'>
      {props.isRunning ? (
        <AdditionalOptionsItem
          className='h-8 w-full cursor-pointer rounded-md p-1 font-normal hover:bg-gray-300'
          text='Stop Workspace'
          onClick={() => {
            props.stopUserWorkspace && props.stopUserWorkspace();
            props.closeAdditionalOptions();
          }}
          icon={<StopIcon className='h-6 w-6' />}
        />
      ) : (
        <>
          <AdditionalOptionsItem
            className='h-8 w-full cursor-pointer rounded-md p-1 font-normal text-red-500 hover:bg-gray-300'
            text='Delete Workspace'
            onClick={() => {
              setModalContent({
                function: UserDeleteWorkspaceModalContent,
                props: { refetch: props.deleteUserWorkspace, setIsModalOpen },
              });
              setIsModalOpen(true);
              props.closeAdditionalOptions();
            }}
            icon={<DeleteIcon className='h-6 w-6 stroke-red-500' />}
          />
          <AdditionalOptionsItem
            className={`h-8 w-full rounded-md p-1 font-normal ${
              userCreateWorkspaceIsFetching ? 'text-gray-400' : 'cursor-pointer hover:bg-gray-300'
            }`}
            text='Restart Workspace'
            onClick={() => {
              props.restartUserWorkspace && props.restartUserWorkspace();
              props.closeAdditionalOptions();
            }}
            icon={<RefreshIcon className='h-6 w-6' />}
            disabled={userCreateWorkspaceIsFetching}
          />
        </>
      )}
    </div>
  );
}

export default AdditionalOptions;

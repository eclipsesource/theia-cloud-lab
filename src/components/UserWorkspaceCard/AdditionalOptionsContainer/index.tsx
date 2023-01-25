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
    <div className='flex items-center flex-col absolute h-auto w-52 top-0 right-8 z-10 bg-gray-100 shadow-lg rounded-lg border border-black border-solid p-1'>
      {props.isRunning ? (
        <AdditionalOptionsItem
          className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md font-normal'
          text='Stop Workspace'
          onClick={() => {
            props.stopUserWorkspace && props.stopUserWorkspace();
            props.closeAdditionalOptions();
          }}
          icon={<StopIcon className='w-6 h-6' />}
        />
      ) : (
        <>
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md text-red-500 font-normal'
            text='Delete Workspace'
            onClick={() => {
              setModalContent({
                function: UserDeleteWorkspaceModalContent,
                props: { refetch: props.deleteUserWorkspace, setIsModalOpen },
              });
              setIsModalOpen(true);
              props.closeAdditionalOptions();
            }}
            icon={<DeleteIcon className='w-6 h-6 stroke-red-500' />}
          />
          <AdditionalOptionsItem
            className={`w-full h-8 p-1 rounded-md font-normal ${
              userCreateWorkspaceIsFetching ? 'text-gray-400' : 'hover:bg-gray-300 cursor-pointer'
            }`}
            text='Restart Workspace'
            onClick={() => {
              props.restartUserWorkspace && props.restartUserWorkspace();
              props.closeAdditionalOptions();
            }}
            icon={<RefreshIcon className='w-6 h-6' />}
            disabled={userCreateWorkspaceIsFetching}
          />
        </>
      )}
    </div>
  );
}

export default AdditionalOptions;

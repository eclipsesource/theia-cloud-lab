import { Dispatch, SetStateAction } from 'react';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import ExclamationIcon from '../icons/ExclamationIcon';
import DeleteIcon from '../icons/DeleteIcon';

export type UserDeleteWorkspaceModalContentProps = {
  refetch?: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const UserDeleteWorkspaceModalContent = (props: UserDeleteWorkspaceModalContentProps) => {
  return (
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
            props.setIsModalOpen(false);
          }}
        />
        <TheiaButton
          className='bg-red-500 hover:bg-red-700'
          text='Delete Workspace'
          icon={<DeleteIcon className='w-6 h-6 stroke-white' />}
          onClick={() => {
            props.refetch && props.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default UserDeleteWorkspaceModalContent;

import { Dispatch, SetStateAction } from 'react';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import ExclamationIcon from '../icons/ExclamationIcon';
import CheckIcon from '../icons/CheckIcon';

export type UserDeleteWorkspaceModalContentProps = {
  refetch?: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const UserDeleteWorkspaceModalContent = (props: UserDeleteWorkspaceModalContentProps) => {
  return (
    <div className='flex h-full w-full flex-col items-center gap-10'>
      <ExclamationIcon className='h-16 w-16' />
      <div className='w-full font-normal'>
        <div>
          You are trying to delete a workspace. All data related to the workspace will be lost. This action cannot be
          undone.
        </div>
        <div>Are you sure?</div>
      </div>
      <div className='flex w-full justify-between'>
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
          icon={<CheckIcon className='h-6 w-6 stroke-white' />}
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

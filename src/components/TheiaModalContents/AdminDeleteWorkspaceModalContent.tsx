import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import ExclamationIcon from '../icons/ExclamationIcon';
import DeleteIcon from '../icons/DeleteIcon';
import { Dispatch, SetStateAction } from 'react';
import { WorkspaceRow } from '../../pages/admin/workspaces';

export type AdminDeleteWorkspaceModalContentProps = {
  refetch: () => void;
  selectedRows: WorkspaceRow[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminDeleteWorkspaceModalContent = (props: AdminDeleteWorkspaceModalContentProps) => {
  return (
    <div className='w-full h-full flex flex-col gap-5 items-center'>
      <ExclamationIcon className='w-16 h-16' />
      <div className='w-full font-normal'>
        You are trying to delete {props.selectedRows.length} workspace{props.selectedRows.length > 1 && 's'}. This
        action cannot be undone.{' '}
        {props.selectedRows.length > 1
          ? 'If they have running sessions, they will be deleted too.'
          : 'If there is a running session, it will be deleted too.'}
        {' Are you sure?'}
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
            props.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AdminDeleteWorkspaceModalContent;

import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import ExclamationIcon from '../icons/ExclamationIcon';
import { Dispatch, SetStateAction } from 'react';
import { WorkspaceRow } from '../../pages/admin/workspaces';
import CheckIcon from '../icons/CheckIcon';

export type AdminDeleteWorkspaceModalContentProps = {
  refetch: () => void;
  selectedRows: WorkspaceRow[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminDeleteWorkspaceModalContent = (props: AdminDeleteWorkspaceModalContentProps) => {
  return (
    <div className='flex h-full w-full flex-col items-center gap-10'>
      <ExclamationIcon className='h-16 w-16' />
      <div className='w-full font-normal'>
        <div>
          You are trying to delete {props.selectedRows.length} workspace{props.selectedRows.length > 1 && 's'}. This
          action cannot be undone.
        </div>
        <div>
          {props.selectedRows.length > 1
            ? 'If they have running sessions, they will be deleted as well.'
            : 'If there is a running session, It will be deleted as well.'}
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
          text={props.selectedRows.length > 1 ? 'Delete Workspace' : 'Delete Workspaces'}
          icon={<CheckIcon className='h-6 w-6 stroke-white' />}
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

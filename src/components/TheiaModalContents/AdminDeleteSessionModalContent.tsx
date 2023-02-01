import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import ExclamationIcon from '../icons/ExclamationIcon';
import { Dispatch, SetStateAction } from 'react';
import { SessionRow } from '../../pages/admin/sessions';
import CheckIcon from '../icons/CheckIcon';

export type AdminDeleteSessionModalContentProps = {
  refetch: () => void;
  selectedRows: SessionRow[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminDeleteSessionModalContent = (props: AdminDeleteSessionModalContentProps) => {
  return (
    <div className='flex h-full w-full flex-col items-center gap-10'>
      <ExclamationIcon className='h-16 w-16' />
      <div className='w-full font-normal'>
        <div>
          You are trying to delete {props.selectedRows.length} session{props.selectedRows.length > 1 && 's'}. This
          action cannot be undone.
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
          text={props.selectedRows.length > 1 ? 'Delete Session' : 'Delete Sessions'}
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

export default AdminDeleteSessionModalContent;

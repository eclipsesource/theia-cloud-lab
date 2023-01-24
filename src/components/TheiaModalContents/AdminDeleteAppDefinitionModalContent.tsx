import { Dispatch, SetStateAction } from 'react';
import TheiaButton from '../TheiaButton';
import CancelIcon from '../icons/CancelIcon';
import ExclamationIcon from '../icons/ExclamationIcon';
import CheckIcon from '../icons/CheckIcon';

export type AdminDeleteAppDefinitionModalContentProps = {
  refetch?: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};


const AdminDeleteAppDefinitionModalContent = (props: AdminDeleteAppDefinitionModalContentProps) => {
    
  return (
    <div className='w-full h-full flex flex-col gap-10 items-center'>
      <ExclamationIcon className='w-16 h-16' />
      <div className='w-full font-normal'>
        <div>
          You are trying to delete a App Definition. All data related to the App Definition will be lost. This action cannot be
          undone.
        </div>
        <div>Are you sure?</div>
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
          text='Delete AppDef'
          icon={<CheckIcon className='w-6 h-6 stroke-white' />}
          onClick={() => {
            props.refetch && props.refetch();
            props.setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AdminDeleteAppDefinitionModalContent;

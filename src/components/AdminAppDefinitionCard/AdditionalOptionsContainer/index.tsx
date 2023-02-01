import { useContext } from 'react';
import DeleteIcon from '../../icons/DeleteIcon';
import PlusIcon from '../../icons/PlusIcon';
import AdditionalOptionsItem from './AdditionalOptionsItem';
import { Context } from '../../../context/Context';
import AdminCreateAppDefinitionModalContent from '../../TheiaModalContents/AdminCreateAppDefinitionModalContent';
import AdminEditAppDefinitionModalContent from '../../TheiaModalContents/AdminEditAppDefinitionModalContent'; // to be changed
import AdminDeleteAppDefinitionModalContent from '../../TheiaModalContents/AdminDeleteAppDefinitionModalContent';
// this is a try commit
type AdditionalOptionProps = {
  isRunning: boolean;
  deleteAppDefinition?: () => void;
  editAppDefinition?: () => void;
  closeAdditionalOptions: () => void;
  createAdminAppDefinition?: () => void;
};

function AdditionalOptions(props: AdditionalOptionProps) {
  const { setModalContent, setIsModalOpen } = useContext(Context);
  return (
    <div className='absolute top-0 right-8 z-10 flex h-auto w-52 flex-col items-center rounded-lg border border-solid border-black bg-gray-100 p-1 shadow-lg'>
      <>
        <AdditionalOptionsItem
          className='h-8 w-full cursor-pointer rounded-md p-1 font-normal hover:bg-gray-300'
          text='Edit App Def'
          onClick={() => {
            setModalContent({
              function: AdminEditAppDefinitionModalContent,
              props: { refetch: props.editAppDefinition, setIsModalOpen },
            });
            setIsModalOpen(true);
            props.closeAdditionalOptions();
            //props.editAppDefinition && props.editAppDefinition();
            props.closeAdditionalOptions();
          }}
          icon={<PlusIcon className='h-6 w-6' />}
        />
      </>

      <>
        <AdditionalOptionsItem
          className='h-8 w-full cursor-pointer rounded-md p-1 font-normal text-red-500 hover:bg-gray-300'
          text='Delete App Def'
          onClick={() => {
            setModalContent({
              function: AdminDeleteAppDefinitionModalContent,
              props: { refetch: props.deleteAppDefinition, setIsModalOpen },
            });
            setIsModalOpen(true);
            //props.deleteAppDefinition && props.deleteAppDefinition();
            props.closeAdditionalOptions();
          }}
          icon={<DeleteIcon className='h-6 w-6 stroke-red-500' />}
        />
      </>
    </div>
  );
}

export default AdditionalOptions;

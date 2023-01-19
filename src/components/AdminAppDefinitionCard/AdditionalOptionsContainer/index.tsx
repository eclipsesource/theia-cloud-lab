import { useContext } from 'react';
import DeleteIcon from '../../icons/DeleteIcon';
import PlusIcon from '../../icons/PlusIcon';
import AdditionalOptionsItem from './AdditionalOptionsItem';
import { Context } from '../../../context/Context';
import AdminCreateAppDefinitionModalContent from '../../TheiaModalContents/AdminCreateAppDefinitionModalContent'; // to be changed

type AdditionalOptionProps = {
  isRunning: boolean;
  deleteAdminAppDefinition?: () => void;
  createAdminAppDefinition?: () => void;
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
            text='Create App Definition'
            onClick={() => {
              setModalContent({
                function: AdminCreateAppDefinitionModalContent,
                props: { refetch: props.deleteAdminAppDefinition, setIsModalOpen },
              });
              setIsModalOpen(true);
              props.closeAdditionalOptions();
            }}
            icon={<PlusIcon className='w-6 h-6' />}
          />
        </>
      ) : (
        <>
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md text-red-500 font-normal'
            text='Delete App Definition'
            onClick={() => {
              setModalContent({
                function: AdminCreateAppDefinitionModalContent,
                props: { refetch: props.deleteAdminAppDefinition, setIsModalOpen },
              });
              setIsModalOpen(true);
              props.closeAdditionalOptions();
            }}
            icon={<DeleteIcon className='w-6 h-6 stroke-red-500' />}
          />
        </>
      )}
    </div>
  );
}

export default AdditionalOptions;

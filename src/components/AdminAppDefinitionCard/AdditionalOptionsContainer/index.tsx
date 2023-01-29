import { useContext } from 'react';
import DeleteIcon from '../../icons/DeleteIcon';
import PlusIcon from '../../icons/PlusIcon';
import AdditionalOptionsItem from './AdditionalOptionsItem';
import { Context } from '../../../context/Context';
import AdminCreateAppDefinitionModalContent from '../../TheiaModalContents/AdminCreateAppDefinitionModalContent';
import AdminEditAppDefinitionModalContent from '../../TheiaModalContents/AdminEditAppDefinitionModalContent'; // to be changed
import AdminDeleteAppDefinitionModalContent from '../../TheiaModalContents/AdminDeleteAppDefinitionModalContent';
import { AdminAppDefinitionCRData } from '../../../../types/AdminAppDefinitionCRData';
// this is a try commit
type AdditionalOptionProps = {
  refresh?: () => void;
  deleteAppDefinition?: () => void;
  editAppDefinition?: () => void;
  closeAdditionalOptions: () => void;
  createAdminAppDefinition?: () => void;
  adminAppDefinitionCRData?: AdminAppDefinitionCRData;
};

function AdditionalOptions(props: AdditionalOptionProps) {
  const { keycloak, setModalContent, setIsModalOpen } = useContext(Context);
  return (
    <div className='flex items-center flex-col absolute h-auto w-52 top-0 right-8 z-10 bg-gray-100 shadow-lg rounded-lg border border-black border-solid p-1'>
      <>
        <AdditionalOptionsItem
          className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md font-normal'
          text='Edit App Def'
          onClick={() => {
            setModalContent({
              function: AdminEditAppDefinitionModalContent,
              props: {
                refetch: props.refresh,
                setIsModalOpen,
                adminAppDefinitionCRData: props.adminAppDefinitionCRData,
                keycloak: keycloak,
              },
            });
            setIsModalOpen(true);
            props.closeAdditionalOptions();
          }}
          icon={<PlusIcon className='w-6 h-6' />}
        />
      </>

      <>
        <AdditionalOptionsItem
          className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md text-red-500 font-normal'
          text='Delete App Def'
          onClick={() => {
            setModalContent({
              function: AdminDeleteAppDefinitionModalContent,
              props: { refetch: props.deleteAppDefinition, setIsModalOpen },
            });
            setIsModalOpen(true);
            props.closeAdditionalOptions();
          }}
          icon={<DeleteIcon className='w-6 h-6 stroke-red-500' />}
        />
      </>
    </div>
  );
}

export default AdditionalOptions;

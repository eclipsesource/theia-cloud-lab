import { UserWorkspaceCardProps } from '../../UserWorkspaceCard';
import AdditionalOptionsItem from './AdditionalOptionsItem';

type AdditionalOptionProps = {
  status: UserWorkspaceCardProps['status'];
  deleteUserWorkspace?: () => void;
  restartUserWorkspace?: () => void;
  stopUserWorkspace?: () => void;
};

function AdditionalOptions(props: AdditionalOptionProps) {
  return (
    <div className='absolute h-max w-64 top-0 right-8 z-10 bg-gray-100 shadow-lg rounded-lg border border-black border-solid p-1'>
      {props.status === 'Running' ? (
        <>
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md'
            text='Stop Workspace'
            onClick={props.stopUserWorkspace}
          />
        </>
      ) : (
        <>
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md text-red-500'
            text='Delete Workspace'
            onClick={props.deleteUserWorkspace}
          />
          <AdditionalOptionsItem
            className='w-full h-8 hover:bg-gray-300 cursor-pointer p-1 rounded-md'
            text='Restart Workspace'
            onClick={props.restartUserWorkspace}
          />
        </>
      )}
    </div>
  );
}

export default AdditionalOptions;

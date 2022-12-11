type AdditionalOptionProps = {
  status: string;
};

function AdditionalOptions({ status }: AdditionalOptionProps) {
  return (
    <div className='absolute w-max top-7 right-0 z-10 bg-transparent shadow-lg hover:bg-gray-50  rounded-md border border-black border-solid p-2 animate-additional-options'>
      <li className='flex rounded hover:text-gray-900 cursor-pointer'>
        {status === 'Running' && 'Stop Session'}
        {status === 'Stopped' && 'Restart Session'}
      </li>
    </div>
  );
}

export default AdditionalOptions;

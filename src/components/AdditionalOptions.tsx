type AdditionalOptionProps = {
  status: string;
};

function AdditionalOptions({ status }: AdditionalOptionProps) {
  return (
    <div className='absolute h-max w-40 top-0 right-8 z-10 bg-gray-100 shadow-xl rounded-xl border border-black border-solid p-2'>
      <ul>
        {status === 'Running' && <li className='hover:bg-gray-300 cursor-pointer p-1 rounded-md'>Stop Session</li>}
        {status === 'Stopped' && <li className='hover:bg-gray-300 cursor-pointer p-1 rounded-md'>Restart Session</li>}
      </ul>
    </div>
  );
}

export default AdditionalOptions;

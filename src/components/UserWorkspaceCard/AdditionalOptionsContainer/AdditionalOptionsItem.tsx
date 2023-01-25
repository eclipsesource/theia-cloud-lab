type AdditionalOptionsItemProps = {
  className?: string;
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

function AdditionalOptionsItem(props: AdditionalOptionsItemProps) {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span className='flex gap-2 h-full'>
        <span className='h-full w-6'>{props.icon && props.icon}</span>
        <span className='h-full'>{props.text}</span>
      </span>
    </button>
  );
}

export default AdditionalOptionsItem;

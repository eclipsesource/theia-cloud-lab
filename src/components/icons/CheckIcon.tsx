export type CheckIconProps = {
  className?: string;
};

function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={props.className ? props.className : 'h-6 w-6'}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M4.5 12.75l6 6 9-13.5'
      />
    </svg>
  );
}

export default CheckIcon;

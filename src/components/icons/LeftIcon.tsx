export type LeftIconProps = {
  className?: string;
};

function LeftIcon(props: LeftIconProps) {
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
        d='M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5'
      />
    </svg>
  );
}

export default LeftIcon;

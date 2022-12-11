export type RestartIconProps = {
  className?: string;
};

function RestartIcon(props: RestartIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={props.className ? props.className : 'w-6 h-6'}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26l1.46-1.46c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74l-1.46 1.46c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z'
      />
    </svg>
  );
}

export default RestartIcon;

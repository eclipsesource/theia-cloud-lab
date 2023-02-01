import React from 'react';

export type TheiaButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  icon?: JSX.Element;
  className?: string;
};

function TheiaButton({ text, icon, className, ...props }: TheiaButtonProps) {
  return (
    <button
      className={`inline-flex items-center rounded bg-blue-500 py-2 px-4 font-bold text-white shadow hover:bg-blue-700 disabled:bg-blue-300  ${className}`}
      {...props}
    >
      <span className='flex w-full items-center justify-center gap-1'>
        {icon && icon}
        {text !== '' && <span className='hidden items-center justify-center lg:flex'>{text}</span>}
      </span>
    </button>
  );
}

export default TheiaButton;

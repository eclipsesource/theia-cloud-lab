import React from 'react';

export type TheiaButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  icon?: JSX.Element;
  className?: string;
};

function TheiaButton({ text, icon, className, ...props }: TheiaButtonProps) {
  return (
    <button
      className={`inline-flex items-center bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded shadow ${className}`}
      {...props}
    >
      <span className='flex gap-1 items-center hover:animate-pulse'>
        {icon && icon}
        <span className='leading-none'>{text}</span>
      </span>
    </button>
  );
}

export default TheiaButton;

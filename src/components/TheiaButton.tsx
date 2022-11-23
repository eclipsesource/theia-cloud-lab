import React from 'react';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: JSX.Element;
  className?: string;
}
function TheiaButton({ text, icon, className, ...props }: IButtonProps) {
  return (
    <button
      className={`inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow ${className}`}
      {...props}
    >
      {icon && icon}
      <span className='ml-2'>{text}</span>
    </button>
  );
}

export default TheiaButton;

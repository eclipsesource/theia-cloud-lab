interface ITextProps {
  text: string;
  className?: string;
}

const TextHeader = (props: ITextProps) => {
  return <div className='text-lg text-gray-600 hover:text-gray-800 hover:underline'>{props.text}</div>;
};

export default TextHeader;

import TextHeader from './TextHeader';

interface ITableContainerProps {
  header: string;
  children: React.ReactNode;
}

const TableContainer = (props: ITableContainerProps) => {
  return (
    <div className='flex-col'>
      <TextHeader text={props.header} />
      <div className='flex py-6'>{props.children}</div>
    </div>
  );
};

export default TableContainer;

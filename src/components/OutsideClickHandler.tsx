import { useEffect, useRef } from 'react';

const OutsideClickHandler = ({ onClickOutside, ...props }: any) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      onClickOutside();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, wrapperRef]);

  return <div ref={wrapperRef}>{props.children}</div>;
};

export default OutsideClickHandler;

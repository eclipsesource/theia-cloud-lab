import { useEffect, useState } from 'react';

const Sessions = () => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setIsFetching(true);
    fetch('/api/admin/sessions/cr')
      .then((res) => res.json())
      .then((data) => {
        console.log('crs', data);
      })
      .catch((error) => {
        console.log('Error occured fetching data: ', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div>hi</div>;
};

export default Sessions;

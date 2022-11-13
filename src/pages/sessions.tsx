import { useEffect, useState } from 'react';
import TableContainer from '../components/TableContainer';
import { SessionData } from './api/sessions';

const Sessions = () => {
  const [data, setData] = useState<[] | null>(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log('fetch metrics');
      fetch('/api/metrics')
        .then((res) => {
          console.log('res', res);
          return res.json();
        })
        .then((metrics) => {
          console.log('metrics', metrics);
          setMetrics(metrics);
        });
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;
  return (
    <TableContainer header='Running sessions'>
      {data.map((item: SessionData) => {
        return <div key={item.app}>{item.app}</div>;
      })}
    </TableContainer>
  );
};

export default Sessions;

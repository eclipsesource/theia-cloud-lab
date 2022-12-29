import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

const Statistics = () => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  return (
    <div className='flex w-1/2'>
      <Line
        datasetIdKey='id'
        data={{
          labels: ['Timestamp 1', 'Timestamp 2', 'Timestamp 3'],
          datasets: [
            {
              label: 'label 1',
              data: [5, 6, 7, 10, 11, 12],
            },
            {
              label: 'label 2',
              data: [3, 2, 1],
            },
          ],
        }}
        height='200px'
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
};
export default Statistics;

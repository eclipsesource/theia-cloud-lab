import { V1PodList, V1StatusDetails } from '@kubernetes/client-node';
import TableContainer from '../components/TableContainer';

const Sessions = () => {
  const getApiRes = async () => {
    const namespace = 'theiacloud';
    const results = await fetch(`/api/sessions/${namespace}`);
    const res = await results.json();
    console.log(getPodData(res));
    console.log(res);
  };

  const getPodData = (res: V1PodList) => {
    const regex = /^ws-.*-session/g;
    const dataArr: any[] = [];
    res.items.forEach((each) => {
      const labels = each.metadata?.labels;
      const sessionString = labels?.app;
      if (sessionString?.match(regex)) {
        const { hostIP, phase, podIP, qosClass, startTime }: any = each.status;
        const obj = { app: sessionString, hostIP, phase, podIP, qosClass, startTime };
        dataArr.push(obj);
      }
    });
    return dataArr;
  };

  getApiRes();
  return <TableContainer header='Running sessions'>Here insert table</TableContainer>;
};

export default Sessions;

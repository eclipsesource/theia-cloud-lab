import React, { useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Collapsible from '../../components/Collapsible';
import GlobalResourceUsageGraph from '../../components/Graphs/GlobalResourceUsageGraph';
import GlobalWorkspacesGraph from '../../components/Graphs/GlobalWorkspacesGraph';
import GlobalSessionsGraph from '../../components/Graphs/GlobalSessionsGraph';
import annotationPlugin from 'chartjs-plugin-annotation';
import PerUserResourceUsageGraph from '../../components/Graphs/PerUserResourceUsageGraph';

dayjs.extend(localizedFormat);

const Statistics = () => {
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(false);
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(false);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [isResourceUsagePerUserExpanded, setIsResourceUsagePerUserExpanded] = useState(false);

  // const getRandomBorderColor = () => {
  //   const num = Math.round(0xffffff * Math.random());
  //   const r = num >> 16;
  //   const g = num >> 8 & 255;
  //   const b = num & 255;
  //   return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  // }

  return (
    <div className='p-5 flex gap-5 flex-col'>
      <Collapsible
        title='Sessions'
        expanded={isSessionsExpanded}
        onChange={(event, expanded) => {
          setIsSessionsExpanded(expanded);
        }}
      >
        <GlobalSessionsGraph />
      </Collapsible>
      <Collapsible
        title='Workspaces'
        expanded={isWorkspacesExpanded}
        onChange={(event, expanded) => {
          setIsWorkspacesExpanded(expanded);
        }}
      >
        <GlobalWorkspacesGraph />
      </Collapsible>
      <Collapsible
        title='Resource Consumption'
        expanded={isResourcesExpanded}
        onChange={(event, expanded) => {
          setIsResourcesExpanded(expanded);
        }}
      >
        <GlobalResourceUsageGraph />
      </Collapsible>
      <Collapsible
        title='Resource Consumption Per User'
        expanded={isResourceUsagePerUserExpanded}
        onChange={(event, expanded) => {
          setIsResourceUsagePerUserExpanded(expanded);
        }}
      >
        <PerUserResourceUsageGraph />
      </Collapsible>
    </div>
  );
};
export default Statistics;

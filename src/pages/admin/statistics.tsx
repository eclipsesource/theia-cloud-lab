import React, { useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Collapsible from '../../components/Collapsible';
import GlobalResourceUsageGraph from '../../components/Graphs/GlobalResourceUsageGraph';
import GlobalWorkspacesGraph from '../../components/Graphs/GlobalWorkspacesGraph';
import GlobalSessionsGraph from '../../components/Graphs/GlobalSessionsGraph';
import GlobalAppDefUsageGraph from '../../components/Graphs/GlobalAppDefUsageGraph';
import PerUserResourceUsageGraph from '../../components/Graphs/PerUserResourceUsageGraph';
import TheiaButton from '../../components/TheiaButton';
import { Switch } from '@mui/material';

dayjs.extend(localizedFormat);

const Statistics = () => {
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(false);
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(false);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [isAppDefExpanded, setIsAppDefExpanded] = useState(false);
  const [isResourceUsagePerUserExpanded, setIsResourceUsagePerUserExpanded] = useState(false);
  const [isSortByCPUUsage, setIsSortByCPUUsage] = useState(true);

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
        title='App Definitions'
        expanded={isAppDefExpanded}
        onChange={(event, expanded) => {
          setIsAppDefExpanded(expanded);
        }}
      >
        <GlobalAppDefUsageGraph />
      </Collapsible>
      <Collapsible
        title='Resource Consumption Per User'
        expanded={isResourceUsagePerUserExpanded}
        onChange={(event, expanded) => {
          setIsResourceUsagePerUserExpanded(expanded);
        }}
      >
        <>
          <div className='flex justify-end items-center'>
            <span className='text-gray-400'>Sort by CPU Usage</span>
            <Switch
              onChange={(e) => {
                if (e.target.checked) {
                  setIsSortByCPUUsage(false);
                } else {
                  setIsSortByCPUUsage(true);
                }
              }}
            />
            <span className='text-gray-400'>Sort by Memory Usage</span>
          </div>

          <PerUserResourceUsageGraph isSortByCPUUsage={isSortByCPUUsage} />
        </>
      </Collapsible>
    </div>
  );
};
export default Statistics;

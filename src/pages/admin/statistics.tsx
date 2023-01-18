import React, { useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Collapsible from '../../components/Collapsible';
import GlobalResourceUsageGraph from '../../components/Graphs/GlobalResourceUsageGraph';
import GlobalWorkspacesGraph from '../../components/Graphs/GlobalWorkspacesGraph';
import GlobalSessionsGraph from '../../components/Graphs/GlobalSessionsGraph';

dayjs.extend(localizedFormat);

const Statistics = () => {
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(false);
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(false);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);

  return (
    <>
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
      </div>
    </>
  );
};
export default Statistics;

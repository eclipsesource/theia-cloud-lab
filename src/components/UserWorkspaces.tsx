import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { UserSessionCRData } from '../../types/UserSessionCRData';
import { UserWorkspaceCRData } from '../../types/UserWorkspaceCRData';
import UserWorkspaceCard, { UserWorkspaceCardProps } from './UserWorkspaceCard';

export type UserWorkspacesProps = {
  workspaces: UserWorkspaceCRData[];
  sessions: UserSessionCRData[];
};

export default function UserWorkspaces(props: UserWorkspacesProps) {
  const [workspaceCardsData, setWorkspaceCardsData] = useState<UserWorkspaceCardProps[]>([]);

  const setCardsData = (workspaces: UserWorkspaceCRData[], sessions: UserSessionCRData[]) => {
    const cardsData: UserWorkspaceCardProps[] = [];
    for (const workspace of workspaces) {
      let isMatched = false;
      for (const session of sessions) {
        if (session.workspace === workspace.name) {
          isMatched = true;
          const cardData: UserWorkspaceCardProps = {
            status: 'Running',
            name: workspace.name,
            lastActivity: dayjs(session.lastActivity).toString(),
            appDefinition: workspace.appDefinition,
            url: session.url,
            cpuUsage: 'CPU',
            memoryUsage: 'MEMORY',
          };
          cardsData.push(cardData);
          break;
        }
      }
      if (!isMatched) {
        const cardData: UserWorkspaceCardProps = {
          status: 'Stopped',
          name: workspace.name,
          lastActivity: 'No Data',
          appDefinition: workspace.appDefinition,
          url: '',
          cpuUsage: 'CPU',
          memoryUsage: 'MEMORY',
        };
        cardsData.push(cardData);
      }
    }
    setWorkspaceCardsData(cardsData);
  };

  useEffect(() => {
    setCardsData(props.workspaces, props.sessions);
  }, [props.workspaces, props.sessions]);

  return (
    <>
      {workspaceCardsData && workspaceCardsData.length > 0 ? (
        workspaceCardsData.map((cardProps) => (
          <UserWorkspaceCard
            key={cardProps.name}
            {...cardProps}
          />
        ))
      ) : (
        <div>No workspaces found</div>
      )}
    </>
  );
}

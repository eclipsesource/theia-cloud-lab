'use client';

import { createContext, Dispatch, SetStateAction } from 'react';
import Keycloak from 'keycloak-js';
import { WorkspaceRow } from '../pages/admin/workspaces';
import { SessionRow } from '../pages/admin/sessions';
import { AdminAppDefinitionCRData } from '../../types/AdminAppDefinitionCRData';

export type ModalContent = {
  function: (props: any) => JSX.Element;
  props: {
    refetch?: () => void;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    refresh?: () => void;
    keycloak?: Keycloak;
    selectedRows?: WorkspaceRow[] | SessionRow[];
    workspaceName?: string;
    appDefinition?: string;
    adminAppDefinitionCRData?: AdminAppDefinitionCRData;
  };
};

export const Context = createContext({
  keycloak: {} as Keycloak,
  isModalOpen: false,
  setIsModalOpen: (() => undefined) as Dispatch<SetStateAction<boolean>>,
  modalContent: {} as ModalContent,
  setModalContent: (() => undefined) as Dispatch<SetStateAction<ModalContent>>,
  adminCreateSessionIsFetching: false,
  setAdminCreateSessionIsFetching: (() => undefined) as Dispatch<SetStateAction<boolean>>,
  adminCreateWorkspaceIsFetching: false,
  setAdminCreateWorkspaceIsFetching: (() => undefined) as Dispatch<SetStateAction<boolean>>,
  userCreateWorkspaceIsFetching: false,
  setUserCreateWorkspaceIsFetching: (() => undefined) as Dispatch<SetStateAction<boolean>>,
  userSwitchWorkspaceFromTo: [] as string[],
  setUserSwitchWorkspaceFromTo: (() => undefined) as Dispatch<SetStateAction<string[]>>,
  adminCreateAppDefinitionIsFetching: false,
  setAdminCreateAppDefinitionIsFetching: (() => undefined) as Dispatch<SetStateAction<boolean>>,
  adminEditAppDefinitionIsFetching: false,
  setAdminEditAppDefinitionIsFetching: (() => undefined) as Dispatch<SetStateAction<boolean>>,
  adminEditAppDefinitionName: '',
  setAdminEditAppDefinitionName: (() => undefined) as Dispatch<SetStateAction<string>>,
});

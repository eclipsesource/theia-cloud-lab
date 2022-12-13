'use client';

import { createContext, Dispatch, SetStateAction } from 'react';
import Keycloak from 'keycloak-js';

export const Context = createContext({
  keycloak: {} as Keycloak,
  isModalOpen: false,
  setIsModalOpen: (() => undefined) as Dispatch<SetStateAction<boolean>>,
  modalContent: <></>,
  setModalContent: (() => undefined) as Dispatch<SetStateAction<JSX.Element>>,
});

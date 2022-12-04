'use client';

import { createContext } from 'react';
import Keycloak from 'keycloak-js';

export const KeycloakContext = createContext({
  keycloak: {} as Keycloak,
});

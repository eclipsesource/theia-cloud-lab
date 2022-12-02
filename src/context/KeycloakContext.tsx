'use client';

import Keycloak from 'keycloak-js';
import { createContext } from 'react';

export const KeycloackContext = createContext({
  keycloakValue: {},
  keycloakLogout: () => {},
});

'use client';

import { createContext } from 'react';

export const LoginContext = createContext({
  token: {},
  setToken: (val: any) => {},
});

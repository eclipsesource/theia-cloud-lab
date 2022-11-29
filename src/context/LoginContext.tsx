'use client';

import { createContext } from 'react';

export const LoginContext = createContext({
  userType: 'user',
  setUserType: (val: string) => {},
});

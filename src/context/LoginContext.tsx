'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

type loginContextType = {
  userType: string;
  setUserType: (val: string) => void;
};

type Props = {
  children: ReactNode;
};

const loginContextDefaultValues: loginContextType = {
  userType: 'user',
  setUserType: (val: string) => {},
};

const LoginContext = createContext<loginContextType>(loginContextDefaultValues);

export function useLogin() {
  return useContext(LoginContext);
}

export function LoginProvider({ children }: Props) {
  const [user, setUser] = useState<string>('');

  const setUserType = (val: string) => {
    setUser(val);
  };

  const value = {
    userType: user,
    setUserType,
  };
  return (
    <>
      <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
    </>
  );
}

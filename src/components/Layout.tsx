import React, { useState } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useLogin } from '../context/LoginContext';
import Login from '../pages/login';

export default function Layout({ children }: any) {
  const { userType } = useLogin();

  return (
    <div className='flex'>
      {userType === '' ? (
        <Login />
      ) : (
        <>
          <SidebarMenu />
          <div className='w-[calc(100vw-15rem)] h-screen'>
            <main
              role='main'
              className='h-full'
            >
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

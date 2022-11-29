import React, { useContext, useEffect } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { LoginContext } from '../context/LoginContext';

export default function Layout({ children }: any) {
  return (
    <div className='flex'>
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
    </div>
  );
}

import React from 'react';
import SidebarMenu from '../components/SidebarMenu';

export default function Layout({ children }: any) {
  return (
    <div className='flex'>
      <SidebarMenu />
      <div className='w-[calc(100vw-15rem)] h-screen'>
        <main
          role='main'
          className='h-full'
        >
          {children}
        </main>
      </div>
    </div>
  );
}

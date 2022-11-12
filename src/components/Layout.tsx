import React from 'react';
import SidebarMenu from '../components/SidebarMenu';

export default function Layout({ children }: any) {
  return (
    <div className='flex'>
      <SidebarMenu />
      <div className='w-[calc(100vw-15rem)] h-screen py-6 px-6'>
        <main role='main'>{children}</main>
      </div>
    </div>
  );
}

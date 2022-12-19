import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import SidebarMenu from './SidebarMenu';

export default function Layout({ children }: any) {
  const { keycloak } = useContext(Context);
  const [userType, setUserType] = useState('user');
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  useEffect(() => {
    keycloak && keycloak.resourceAccess && setUserType(keycloak.resourceAccess['theia-cloud'].roles[0]);
  }, [keycloak, userType]);

  return (
    <div className='flex'>
      <>
        <SidebarMenu
          isSidebarClosed={isSidebarClosed}
          setIsSidebarClosed={setIsSidebarClosed}
        />
        <div className={`${isSidebarClosed ? 'w-screen' : 'w-[calc(100vw-15rem)]'} h-screen`}>
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

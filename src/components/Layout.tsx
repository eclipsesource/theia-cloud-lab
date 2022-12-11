import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { KeycloakContext } from '../context/KeycloakContext';
import Custom404 from '../pages/404';

export default function Layout({ children }: any) {
  const { keycloak } = useContext(KeycloakContext);
  const [userType, setUserType] = useState('user');
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    keycloak && keycloak.resourceAccess && setUserType(keycloak.resourceAccess['theia-cloud'].roles[0]);
  }, [keycloak, userType]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (userType === 'user') {
        if (window.location.href.includes('/admin')) {
          router.push('/');
        }
      }
      if (userType === 'admin') {
        if (!window.location.href.includes('/admin')) {
          router.push('/');
        }
      }
    }
  }, [isMounted, router, userType]);

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

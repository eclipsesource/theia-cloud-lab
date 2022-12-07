import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { KeycloakContext } from '../context/KeycloakContext';
import Custom404 from '../pages/404';

export default function Layout({ children }: any) {
  const { keycloak } = useContext(KeycloakContext);
  const [userType, setUserType] = useState('user');
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    keycloak && keycloak.resourceAccess && setUserType(keycloak.resourceAccess['theia-cloud'].roles[0]);
  }, [keycloak, userType]);

  const shouldShowTheErrorPage = () => {
    if (userType === 'user') {
      if (window.location.href.includes('/admin')) {
        return true;
      }
    }
    if (userType === 'admin') {
      if (window.location.href.includes('/user')) {
        return true;
      }
    }
    if (userType === '') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className='flex'>
      {shouldShowTheErrorPage() ? (
        <Custom404 />
      ) : (
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
      )}
    </div>
  );
}

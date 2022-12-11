import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import TheiaSvg from './icons/TheiaSvg';
import LeftIcon from './icons/LeftIcon';
import { KeycloakContext } from '../context/KeycloakContext';
import TheiaButton from './TheiaButton';
import RightIcon from './icons/RightIcon';
import Fade from '@mui/material/Fade';

interface Props {
  isSidebarClosed: boolean;
  setIsSidebarClosed: (val: boolean) => void;
}
const SidebarMenu = ({ isSidebarClosed, setIsSidebarClosed }: Props) => {
  const { keycloak } = useContext(KeycloakContext);
  const [userType, setUserType] = useState('');
  const [dashboardName, setDashboardName] = useState('');

  const adminClassStyle =
    'flex relative items-center px-6 h-12 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer';

  useEffect(() => {
    keycloak && keycloak.resourceAccess && setUserType(keycloak.resourceAccess['theia-cloud'].roles[0]);
    setDashboardName(userType.slice(0, 1).toUpperCase() + userType.slice(1));
  }, [userType]);

  const showAdminMenu = () => {
    return (
      <>
        <li className={`${adminClassStyle} text-m text-gray-800 mb-1`}>
          <Link href='/admin/sessions'>Sessions</Link>
        </li>
        <li className={`${adminClassStyle} text-m text-gray-800 mb-1`}>
          <Link href='/admin/workspaces'>Workspaces</Link>
        </li>
        <li className={`${adminClassStyle} text-m text-gray-800 mb-1`}>App Definitions</li>
      </>
    );
  };

  const showUserMenu = () => {
    return (
      <>
        <li className={`${adminClassStyle} text-m text-gray-800 mb-1`}>
          <Link href='/workspaces'>Workspaces</Link>
        </li>
      </>
    );
  };

  return (
    <>
      {isSidebarClosed ? (
        <div className='flex justify-center shadow-xl	border-r-2'>
          <button onClick={() => setIsSidebarClosed(false)}>
            <RightIcon />
          </button>
        </div>
      ) : (
        <Fade in={!isSidebarClosed}>
          <div className='w-80 h-screen shadow-xl bg-slate-50 sticky py-2 px-4'>
            <div className='flex justify-between'>
              <div className='flex items-center w-20'>
                <TheiaSvg />
              </div>
              <span className='py-2 px-3 text-m text-gray-700'>{`${dashboardName} Dashboard`}</span>
              <button
                className='py-2 text-m text-gray-700'
                onClick={() => setIsSidebarClosed(true)}
              >
                <LeftIcon />
              </button>
            </div>

            <div className='mt-2 relative'>{userType === 'admin' ? showAdminMenu() : showUserMenu()}</div>
            <div className='absolute bottom-3 py-2 px-4'>
              <TheiaButton
                text='Logout'
                onClick={() => keycloak.logout()}
              />
            </div>
          </div>
        </Fade>
      )}
    </>
  );
};

export default SidebarMenu;

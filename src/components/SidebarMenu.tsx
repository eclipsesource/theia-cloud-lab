import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import TheiaSvg from './icons/TheiaSvg';
import { KeycloakContext } from '../context/KeycloakContext';
import TheiaButton from './TheiaButton';

const SidebarMenu = () => {
  const [isAdminSelected, setIsAdminSelected] = useState<boolean>(false);
  const [isUserSelected, setIsUserSelected] = useState<boolean>(false);
  const { keycloak } = useContext(KeycloakContext);
  const [userType, SetUserType] = useState('');
  const [dashboardName, setDashboardName] = useState('');

  const adminClassStyle =
    'flex relative items-center px-6 h-12 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer';

  useEffect(() => {
    keycloak && keycloak.resourceAccess && SetUserType(keycloak.resourceAccess['theia-cloud'].roles[0]);
    setDashboardName(userType.slice(0, 1).toUpperCase() + userType.slice(1));
  }, [userType]);

  const showAdminMenu = () => {
    return (
      <>
        <li className={`${adminClassStyle} text-sm text-gray-800 mb-1 ml-5`}>
          <Link href='/sessions'>see running sessions</Link>
        </li>
        <li className={`${adminClassStyle} text-sm text-gray-800 mb-1 ml-5`}>
          <Link href='/workspaces'>see workspaces</Link>
        </li>
        <li className={`${adminClassStyle} text-sm text-gray-800 mb-1 ml-5`}>see app definitions</li>
      </>
    );
  };

  const showUserMenu = () => {
    return (
      <>
        <li className={`${adminClassStyle} text-sm text-gray-800 mb-1 ml-5`}>see workspaces</li>
        <li className={`${adminClassStyle} text-sm text-gray-800 mb-1 ml-5`}>see sessions</li>
      </>
    );
  };

  return (
    <div className='w-80 h-screen shadow-md bg-slate-50 sticky py-2 px-4'>
      <div className='flex justify-between'>
        <div className='flex items-center w-20'>
          <TheiaSvg />
        </div>
        <span className='py-2 px-3 text-m text-gray-700'>{`${dashboardName} Dashboard`}</span>
      </div>

      <div className='mt-2'>
        <ul className='relative'>
          {userType === 'admin' ? (
            <>
              <li
                className={`${adminClassStyle} text-m text-gray-700`}
                onClick={() => setIsAdminSelected(!isAdminSelected)}
              >
                Admin
              </li>
              {isAdminSelected && showAdminMenu()}
            </>
          ) : (
            <>
              <li
                className={`${adminClassStyle} text-m text-gray-700`}
                onClick={() => setIsUserSelected(!isUserSelected)}
              >
                User
              </li>
              {isUserSelected && showUserMenu()}
            </>
          )}
        </ul>
      </div>
      <div className='absolute bottom-3 py-2 px-4'>
        <TheiaButton
          text='Logout'
          onClick={() => keycloak.logout()}
        />
      </div>
    </div>
  );
};

export default SidebarMenu;

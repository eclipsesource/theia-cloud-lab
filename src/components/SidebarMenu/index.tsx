import { useContext, useEffect, useState } from 'react';
import TheiaSvg from '../icons/TheiaSvg';
import LeftIcon from '../icons/LeftIcon';
import { Context } from '../../context/Context';
import TheiaButton from '../TheiaButton';
import RightIcon from '../icons/RightIcon';
import Fade from '@mui/material/Fade';
import LogoutIcon from '../icons/LogoutIcon';
import SidebarMenuButton from './SidebarMenuButton';

interface Props {
  isSidebarClosed: boolean;
  setIsSidebarClosed: (val: boolean) => void;
}
const SidebarMenu = ({ isSidebarClosed, setIsSidebarClosed }: Props) => {
  const { keycloak } = useContext(Context);
  const [userType, setUserType] = useState('');
  const [dashboardName, setDashboardName] = useState('');

  useEffect(() => {
    keycloak && keycloak.resourceAccess && setUserType(keycloak.resourceAccess['theia-cloud'].roles[0]);
    setDashboardName(userType.slice(0, 1).toUpperCase() + userType.slice(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  return (
    <>
      {isSidebarClosed ? (
        <div className='flex w-6 justify-center border-r-2	bg-slate-100 shadow-lg drop-shadow-lg transition duration-300 ease-in-out hover:bg-slate-300'>
          <button onClick={() => setIsSidebarClosed(false)}>
            <RightIcon />
          </button>
        </div>
      ) : (
        <Fade in={!isSidebarClosed}>
          <div className='sticky h-screen w-80 bg-slate-100 py-2 px-4 shadow-md drop-shadow-md'>
            <div className='flex items-center justify-between'>
              <div className='flex w-20 items-center'>
                <TheiaSvg />
              </div>
              <span className='text-base text-gray-700'>{`${dashboardName} Dashboard`}</span>
              <button
                className='flex h-12 w-12 items-center justify-center rounded-md transition duration-300 ease-in-out hover:bg-slate-300'
                onClick={() => setIsSidebarClosed(true)}
              >
                <LeftIcon />
              </button>
            </div>

            <div className='relative mt-2 flex flex-col gap-1'>
              {userType === 'admin' ? (
                <>
                  <SidebarMenuButton
                    href='/admin/sessions'
                    text='Sessions'
                  />
                  <SidebarMenuButton
                    href='/admin/workspaces'
                    text='Workspaces'
                  />
                  <SidebarMenuButton
                    href='/admin/appdefinitions'
                    text='App Definitions'
                  />
                  <SidebarMenuButton
                    href='/admin/statistics'
                    text='Statistics'
                  />
                  <SidebarMenuButton
                    href='/admin/settings'
                    text='Settings'
                  />
                </>
              ) : (
                <>
                  <SidebarMenuButton
                    href='/workspaces'
                    text='Workspaces'
                  />
                </>
              )}
            </div>
            <div className='absolute bottom-3 py-2 px-4'>
              <TheiaButton
                text='Logout'
                icon={<LogoutIcon />}
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

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
  }, [userType]);

  return (
    <>
      {isSidebarClosed ? (
        <div className='flex justify-center shadow-xl	border-r-2 bg-slate-100 hover:bg-slate-300 transition duration-300 ease-in-out'>
          <button onClick={() => setIsSidebarClosed(false)}>
            <RightIcon />
          </button>
        </div>
      ) : (
        <Fade in={!isSidebarClosed}>
          <div className='w-80 h-screen shadow-xl bg-slate-100 sticky py-2 px-4'>
            <div className='flex justify-between'>
              <div className='flex items-center w-20'>
                <TheiaSvg />
              </div>
              <span className='py-2 px-3 text-m text-gray-700'>{`${dashboardName} Dashboard`}</span>
              <button
                className='p-2 text-m text-gray-700 hover:bg-slate-300 rounded-md transition duration-300 ease-in-out'
                onClick={() => setIsSidebarClosed(true)}
              >
                <LeftIcon />
              </button>
            </div>

            <div className='flex flex-col gap-1 mt-2 relative'>
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
                    href='/admin/statistic'
                    text='Statistics DB Test'
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

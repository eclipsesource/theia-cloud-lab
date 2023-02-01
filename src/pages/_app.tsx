import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '../../configs/keycloak_config';
import { Context, ModalContent } from '../context/Context';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TheiaModal from '../components/TheiaModal';

export default function App({ Component, pageProps }: AppProps) {
  const [shouldRenderLayout, setShouldRenderLayout] = useState(false);
  const [keycloak, setKeycloak] = useState({} as Keycloak);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    function: () => <></>,
    props: { setIsModalOpen: () => {} },
  });
  const [adminCreateSessionIsFetching, setAdminCreateSessionIsFetching] = useState(false);
  const [adminCreateWorkspaceIsFetching, setAdminCreateWorkspaceIsFetching] = useState(false);
  const [adminEditWorkspaceIsFetching, setAdminEditWorkspaceIsFetching] = useState(false);
  const [userCreateWorkspaceIsFetching, setUserCreateWorkspaceIsFetching] = useState(false);
  const [userSwitchWorkspaceFromTo, setUserSwitchWorkspaceFromTo] = useState(['', '']);

  const [userType, setUserType] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // TODO(BORA): remove refetchOnWindowFocus for production
        cacheTime: 0,
      },
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isMounted && keycloak) {
      interval = setInterval(() => {
        console.log('interval fired');
        keycloak
          .updateToken(300)
          .then((refreshed) => {
            if (refreshed) {
              console.log('Token refreshed');
            } else {
              console.log('Token not refreshed');
            }
          })
          .catch(() => {
            console.log('Failed to refresh token');
          });
      }, 120000);
    }
    return () => clearInterval(interval);
  }, [isMounted, keycloak]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const keycloakObj: Keycloak = new Keycloak({
        url: keycloakConfig.keycloakAuthUrl,
        realm: keycloakConfig.keycloakRealm,
        clientId: keycloakConfig.keycloakClientId,
      });

      keycloakObj
        .init({
          onLoad: 'login-required',
          checkLoginIframe: false,
          redirectUri: 'http://localhost:3000',
        })
        .then((auth) => {
          if (!auth) {
            window.location.reload();
          } else {
            //TODO read username as well
            if (keycloakObj) {
              console.log('keycloakObj', keycloakObj);
              setKeycloak(keycloakObj);
              setShouldRenderLayout(true);
              keycloakObj.resourceAccess && setUserType(keycloakObj.resourceAccess['theia-cloud'].roles[0]);
            }
          }
        })
        .catch(() => {
          console.error('Authentication Failed');
        });
    }
  }, [isMounted]);

  useEffect(() => {
    if (userType === 'admin') {
      router.push('/admin/sessions');
    } else if (userType === 'user') {
      router.push('/workspaces');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  return (
    <>
      {shouldRenderLayout ? (
        <QueryClientProvider client={queryClient}>
          <Context.Provider
            value={{
              keycloak,
              isModalOpen,
              setIsModalOpen,
              modalContent,
              setModalContent,
              adminCreateSessionIsFetching,
              setAdminCreateSessionIsFetching,
              adminCreateWorkspaceIsFetching,
              setAdminCreateWorkspaceIsFetching,
              userCreateWorkspaceIsFetching,
              setAdminEditWorkspaceIsFetching,
              adminEditWorkspaceIsFetching,
              setUserCreateWorkspaceIsFetching,
              userSwitchWorkspaceFromTo,
              setUserSwitchWorkspaceFromTo,
            }}
          >
            <TheiaModal />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Context.Provider>
          <ToastContainer
            position='bottom-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      ) : (
        <></>
      )}
    </>
  );
}

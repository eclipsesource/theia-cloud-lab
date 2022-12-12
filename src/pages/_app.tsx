import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '../../configs/keycloak_config';
import { KeycloakContext } from '../context/KeycloakContext';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  const [shouldRenderLayout, setShouldRenderLayout] = useState(false);
  const [keycloak, setKeycloak] = useState({} as Keycloak);
  const [userType, setUserType] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  // TODO(BORA): remove options for production
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: 0,
      },
    },
  });

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
        })
        .then((auth) => {
          if (!auth) {
            window.location.reload();
          } else {
            //TODO read username as well
            if (keycloakObj.token) {
              console.log('keycloakObj', keycloakObj);
              setKeycloak(keycloakObj);
              setShouldRenderLayout(true);
              keycloak && keycloak.resourceAccess && setUserType(keycloak.resourceAccess['theia-cloud'].roles[0]);
            }
          }
        })
        .catch(() => {
          console.error('Authentication Failed');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  useEffect(() => {
    if (userType === 'admin') {
      router.replace('/admin');
    }
  }, [userType, router]);

  useEffect(() => {
    if (keycloak) {
      keycloak.onAuthRefreshSuccess = () => {
        console.log('Auth refresh success');
      };

      keycloak.onAuthRefreshError = () => {
        console.log('Auth refresh error');
      };

      keycloak.onAuthLogout = () => {
        console.log('Auth logout');
      };

      keycloak.onTokenExpired = () => {
        console.log('Token expired');
      };
    }
  }, [keycloak]);

  return (
    <>
      {shouldRenderLayout ? (
        <QueryClientProvider client={queryClient}>
          <KeycloakContext.Provider value={{ keycloak }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </KeycloakContext.Provider>
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

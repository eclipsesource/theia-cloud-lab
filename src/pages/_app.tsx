import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '../../configs/keycloak_config';
import { KeycloakContext } from '../context/KeycloakContext';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const [shouldRenderLayout, setShouldRenderLayout] = useState(false);
  const [keycloak, setKeycloak] = useState({} as Keycloak);
  const [userType, setUserType] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

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

  return (
    <>
      {shouldRenderLayout ? (
        <KeycloakContext.Provider value={{ keycloak }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </KeycloakContext.Provider>
      ) : (
        <></>
      )}
    </>
  );
}

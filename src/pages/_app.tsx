import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '../../configs/keycloak_config';
import { KeycloakContext } from '../context/KeycloakContext';

export default function App({ Component, pageProps }: AppProps) {
  const [shouldRenderLayout, setShouldRenderLayout] = useState(false);
  const [keycloak, setKeycloak] = useState({} as Keycloak);
  const [isMounted, SetIsMounted] = useState(false);

  useEffect(() => {
    SetIsMounted(true);
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
          redirectUri: 'http://localhost:3000',
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
            }
          }
        })
        .catch(() => {
          console.error('Authentication Failed');
        });
    }
  }, [isMounted]);

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

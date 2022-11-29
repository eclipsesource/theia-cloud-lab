import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { LoginContext } from '../context/LoginContext';
import { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '../../configs/keycloak_config';

export default function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState({});
  const [shouldRenderLayout, setShouldRenderLayout] = useState(false);

  useEffect(() => {
    const keycloak = new Keycloak({
      url: keycloakConfig.keycloakAuthUrl,
      realm: keycloakConfig.keycloakRealm,
      clientId: keycloakConfig.keycloakClientId,
    });

    keycloak
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
          if (keycloak.token) {
            setToken(keycloak.token);
          }
        }
        setShouldRenderLayout(true);
      })
      .catch(() => {
        console.error('Authentication Failed');
      });
  }, []);

  return (
    <>
      {shouldRenderLayout ? (
        <LoginContext.Provider value={{ token, setToken }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LoginContext.Provider>
      ) : (
        <></>
      )}
    </>
  );
}

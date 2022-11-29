import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { LoginContext } from '../context/LoginContext';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [userType, setUserType] = useState<string>('user');

  return (
    <LoginContext.Provider value={{ userType, setUserType }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LoginContext.Provider>
  );
}

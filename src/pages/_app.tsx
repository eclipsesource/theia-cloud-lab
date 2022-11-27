import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { LoginProvider } from '../context/LoginContext';

export default function App({ Component, pageProps }: AppProps) {
  const userType = {
    userType: 'user',
    setUserType: () => {},
  };

  return (
    <>
      <LoginProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoginProvider>
    </>
  );
}

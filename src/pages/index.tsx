import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Theia.Cloud Dashboard</title>
        <meta
          name='description'
          content='Dashboard application to monitor and manage your Theia.Cloud cluster'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>
    </>
  );
}

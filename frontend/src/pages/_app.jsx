import React from 'react';
import Navbar from '../components/Navbar';
import Head from 'next/head';
import { ModalProvider } from '../context/ModalContext';
import LoginModal from '../components/LoginModal';
import '../styles/globals.css';

// Standard layout wrapper injection for Next.js Pages routing
function MyApp({ Component, pageProps }) {
  return (
    <ModalProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <Head>
          <title>NayePankh Foundation</title>
          <link rel="icon" type="image/png" href="/favicon.png" />
        </Head>
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <LoginModal />
      </div>
    </ModalProvider>
  );
}

export default MyApp;
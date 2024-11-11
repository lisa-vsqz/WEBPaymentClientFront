import '../styles/globals.css';
import '@progress/kendo-theme-default/dist/all.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import Providers from '../Providers';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}> {/* Wrap the app with SessionProvider */}
      <>
        <Head>
          {/* Load Site.css after Kendo theme */}
          <link
            rel="stylesheet"
            href="https://moja-rockies.paymentevolution.com/V3/Content/Content/sass/Site.css"
          />
        </Head>
        <Providers>
        <Component {...pageProps} />
        </Providers>
      </>
    </SessionProvider>
  );
}

export default MyApp;

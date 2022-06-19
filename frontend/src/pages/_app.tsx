import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <link rel="icon" href="/logo-blue.svg" />
    </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

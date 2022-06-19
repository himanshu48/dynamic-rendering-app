import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '../lib/client/redux/store';

function MyApp({ Component, pageProps }: AppProps) {

  const [assets, setAssets] = useState<any>(null)
  useEffect(()=>{
    fetch('/api/assets').then(res => res.json()).then(res=> setAssets(res))
  },[])
  return <Provider store={store}><Component assets={assets} {...pageProps} /></Provider>
}

export default MyApp

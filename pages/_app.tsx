import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {

  const [assets, setAssets] = useState<any>(null)
  useEffect(()=>{
    fetch('/api/assets').then(res => res.json()).then(res=> setAssets(res))
  },[])
  return <Component assets={assets} {...pageProps} />
}

export default MyApp

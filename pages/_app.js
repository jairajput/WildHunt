import '../styles/globals.css'
import Link from 'next/link'
import Header from '../pages/Header'
import { MoralisProvider } from "react-moralis";



function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <Header /> 
      
      <MoralisProvider serverUrl="https://xvoearmxhxcs.usemoralis.com:2053/server" appId="2ttAA4gqc645HqO2gljrjIvM0km28uupRTNQZI8g">
     
      <Component {...pageProps} />
      </MoralisProvider>
    </div>
  )
}

export default Marketplace
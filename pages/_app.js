import '../styles/globals.css'
import Link from 'next/link'
import Header from '../pages/Header'




function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <Header />



      <Component {...pageProps} />

    </div>
  )
}

export default Marketplace
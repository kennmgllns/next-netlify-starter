import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Dog si Phanie" /> 

        {/* Add image below */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src="/dog.JPG" alt="Dog si Phanie" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

import dynamic from 'next/dynamic'

// Lazy load Map component on client side only
const Map = dynamic(() => import('../components/Map'), {
  ssr: false
})

export default function HomePage() {
  return (
    <div>
      <h1>GPS Tracker</h1>
      <Map />
    </div>
  )
}

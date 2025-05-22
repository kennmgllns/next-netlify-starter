import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

export default function MapView() {
  const [position, setPosition] = useState([14.5995, 120.9842])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/.netlify/functions/upload-data')
        const data = await res.json()
        console.log("Fetched data:", data)
        if (data.lat && data.lng) {
          setPosition([data.lat, data.lng])
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>Sensor location</Popup>
      </Marker>
    </MapContainer>
  )
}

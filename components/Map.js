import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapView() {
  const [sensors, setSensors] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.jsonbin.io/v3/b/68305ba38561e97a501a7dd9/latest', {
          headers: {
            'X-Master-Key': '$2a$10$Ym6dVcpM29hxIDPHbVleFef8yt5NhihdKFfmjTsEPbEDzyzSPfIrq'
          },
          cache: 'no-store'
        });
        const json = await res.json();
        if (Array.isArray(json.record)) {
          setSensors(json.record)
        } else {
          console.error("Expected array but got:", json.record)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <MapContainer center={[14.5995, 120.9842]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {sensors.map((sensor, idx) => {
        const getColor = (value) => {
          if (value < 20) return "#00ff00"
          if (value < 50) return "#ffff00"
          if (value < 80) return "#ff9900"
          return "#ff0000"
        }

        const color = getColor(sensor.value)

        return (
          <CircleMarker
            key={idx}
            center={[sensor.lat, sensor.lng]}
            radius={10}
            color={color}
            fillColor={color}
            fillOpacity={0.8}
          >
            <Popup>Value: {sensor.value}</Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}

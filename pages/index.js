import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Home() {
  const [coords, setCoords] = useState({ lat: 0, lng: 0, sensor: null });

  useEffect(() => {
    async function fetchCoords() {
      const res = await fetch('/.netlify/functions/upload-data');
      const data = await res.json();
      setCoords(data);
    }

    fetchCoords();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[coords.lat, coords.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>Sensor: {coords.sensor}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

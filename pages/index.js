// pages/index.js or a component
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await fetch('https://api.jsonbin.io/v3/b/68305ba38561e97a501a7dd9', {
        headers: {
          'X-Master-Key': '$2a$10$Ym6dVcpM29hxIDPHbVleFef8yt5NhihdKFfmjTsEPbEDzyzSPfIrq' // or move to backend to hide this
        }
      });

      const json = await res.json();
      setData(json.record);
    }

    loadData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Sensor Map</h1>
      <p>Lat: {data.lat}, Lng: {data.lng}, Sensor: {data.sensor}</p>
      {/* Render map component here */}
    </div>
  );
}

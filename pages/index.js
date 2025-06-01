import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MapView = dynamic(() => import('../components/Map'), { ssr: false });

export default function HomePage() {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.jsonbin.io/v3/b/68305ba38561e97a501a7dd9/latest', {
          headers: {
            'X-Master-Key': 'YOUR_SECRET_KEY', // put this in an env variable in real apps
          },
          cache: 'no-store',
        });
        const json = await res.json();
        setSensors(json.record || []);
      } catch (err) {
        console.error('Failed to fetch JSONBin:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Leaf Color Indexing Map</h1>
      <MapView sensors={sensors} />
    </div>
  );
}

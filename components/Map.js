import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import { Delaunay } from 'd3-delaunay';
import { bbox, convex } from '@turf/turf';
import { intersection } from 'martinez-polygon-clipping';
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  const [voronoiPolygons, setVoronoiPolygons] = useState([]);
  const [outerHull, setOuterHull] = useState(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://api.jsonbin.io/v3/b/68305ba38561e97a501a7dd9/latest',
          {
            headers: {
              'X-Master-Key': '$2a$10$Ym6dVcpM29hxIDPHbVleFef8yt5NhihdKFfmjTsEPbEDzyzSPfIrq',
            },
            cache: 'no-store',
          }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const json = await res.json();
        const data = json.record;

        if (!Array.isArray(data.samples) || data.samples.length < 3) {
          console.error('Not enough sample points for hull and Voronoi');
          return;
        }

        const coords = data.samples.map((s) => ({ lng: s.lng, lat: s.lat, color: s.color, panel: s.panel }));
        setPoints(coords);

        // Create convex hull polygon
        const turfPoints = coords.map((c) => [c.lng, c.lat]);
        const hullPolygon = convex({ type: 'FeatureCollection', features: turfPoints.map((p) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: p }
        }))});
        if (!hullPolygon) {
          console.error('Failed to create convex hull');
          return;
        }
        setOuterHull(hullPolygon.geometry.coordinates);

        // Prepare bounding box for Voronoi
        const [minX, minY, maxX, maxY] = bbox(hullPolygon);
        const expand = 0.01;
        const voronoiBBox = [minX - expand, minY - expand, maxX + expand, maxY + expand];

        // Delaunay & Voronoi
        const delaunay = Delaunay.from(coords, (d) => d.lng, (d) => d.lat);
        const voronoi = delaunay.voronoi(voronoiBBox);

        const features = [];

        for (let i = 0; i < coords.length; i++) {
          const cellPolygon = voronoi.cellPolygon(i);
          if (!cellPolygon) continue;

          const cellMartinez = [cellPolygon.map((p) => [p[0], p[1]])];
          const hullMartinez = hullPolygon.geometry.coordinates;

          const clipped = intersection(cellMartinez, hullMartinez);

          if (clipped && clipped.length) {
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: clipped[0],
              },
              properties: {
                color: coords[i].color,
                panel: coords[i].panel,
              },
            });
          }
        }

        setVoronoiPolygons(features);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <MapContainer center={[14.624, 121.052]} zoom={17} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* Removed the red hull outline */}

      {/* Draw Voronoi clipped polygons */}
      {voronoiPolygons.map((feature, idx) => (
        <GeoJSON
          key={idx}
          data={feature}
          style={{
            fillColor: feature.properties.color || '#888888',
            color: '#222',
            weight: 1,
            fillOpacity: 0.6,
          }}
        >
          <Popup>
            <div>
              <strong>Panel:</strong> {feature.properties.panel}
              <br />
              <strong>Color:</strong> {feature.properties.color}
            </div>
          </Popup>
        </GeoJSON>
      ))}

      {/* Removed circles on coordinates */}
    </MapContainer>
  );
}

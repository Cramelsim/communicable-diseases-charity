import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';

const colour = (i) => (i > 0.66 ? '#b71c1c' : i > 0.33 ? '#ef6c00' : '#f9a825');

/** Marker size and colour scale with each area's share of the highest case count. */
export default function DiseaseMap({ markers }) {
  const center = markers.length ? [markers[0].latitude, markers[0].longitude] : [0, 20];
  return (
    <MapContainer center={center} zoom={markers.length === 1 ? 6 : 3} className="map" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <CircleMarker
          key={m.area}
          center={[m.latitude, m.longitude]}
          radius={8 + m.intensity * 22}
          pathOptions={{ color: colour(m.intensity), fillOpacity: 0.55 }}
        >
          <Popup>
            <strong><Link to={`/areas/${m.area}`}>{m.name}</Link></strong>
            <br />
            {m.total_cases.toLocaleString()} cases · {m.total_deaths.toLocaleString()} deaths
            {m.cases_per_100k != null && <><br />{m.cases_per_100k} cases per 100k people</>}
            <ul>
              {m.diseases.map((d) => (
                <li key={d.disease}>{d.name}: {d.cases.toLocaleString()}</li>
              ))}
            </ul>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

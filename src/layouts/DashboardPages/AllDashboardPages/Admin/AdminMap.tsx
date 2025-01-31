
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Updated locations with latitude and longitude
const locations = [
  {
    user: 'kasozi Paul',
    name: 'Kampala',
    position: [0.3136, 32.5811] as LatLngTuple, // Cast to LatLngTuple
  },
  {
    user: 'kasozi Paul',
    name: 'Entebbe',
    position: [0.0575, 32.4478] as LatLngTuple, // Cast to LatLngTuple
  },
  {
    user: 'kasozi Paul',
    name: 'Mbarara',
    position: [-0.6127, 30.6545] as LatLngTuple, // Cast to LatLngTuple
  },
  {
    user: 'kasozi Paul',
    name: 'Gulu',
    position: [2.7728, 32.2964] as LatLngTuple, // Cast to LatLngTuple
  },
  {
    user: 'kasozi Paul',
    name: 'Jinja',
    position: [0.4592, 33.2028] as LatLngTuple, // Cast to LatLngTuple
  },
];

const MapComponent = () => {
  return (
    <div style={{ height: '500px' }}>
      <MapContainer center={[1.3733, 32.2903]} zoom={7} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render markers for each location */}
        {locations.map((location, index) => (
          <Marker key={index} position={location.position}>
            <Popup>{location.name} {location.user}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

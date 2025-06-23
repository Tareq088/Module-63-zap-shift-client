import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

// const districtData = [
//   { district: 'Dhaka', latitude: 23.8103, longitude: 90.4125 },
//   { district: 'Faridpur', latitude: 23.6, longitude: 89.8333 },
//   { district: 'Gazipur', latitude: 23.9999, longitude: 90.4203 },
//   { district: 'Chattogram', latitude: 22.3569, longitude: 91.8123 },
//   // ➕ Add remaining districts here
// ];

const FlyToDistrict = ({ position }) => {
  const map = useMap();
  if (position) {
    map.flyTo(position, 10,{duration: 1.5});
  }
  return null;
};

const Coverage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [districtData, setDistrictData] = useState([])

  useEffect(()=>{
    fetch("../../../public/warehouses.json")
    .then(res => res.json()
    .then(data=>{
        setDistrictData(data)
    }))
},[])

  const handleSearch = (e) => {
    e.preventDefault();
    const found = districtData.find((d) =>
      d.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (found) {
      setFlyToPosition([found.latitude, found.longitude]);
    }
  };

  return (
    <div className="py-12 px-4 md:px-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        We are available in 64 districts
      </h1>

      {/* 🔍 Search Box */}
      <form onSubmit={handleSearch} className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search district"
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary ml-2">Go</button>
      </form>

      <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✈️ Fly to searched district */}
          <FlyToDistrict position={flyToPosition} />

          {/* 📍 All markers */}
          {districtData.map((district, index) => (
            <Marker
              key={index}
              position={[district.latitude, district.longitude]}
            >
              <Popup>   
                {district.district} Branch
                {district.covered_area.join(",")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;

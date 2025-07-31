import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix default icon issue (with valid shadow icon to remove square)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Valid lat/lng checker
const isValidLatLng = (lat, lng) =>
  typeof lat === "number" &&
  typeof lng === "number" &&
  !isNaN(lat) &&
  !isNaN(lng);

// Component to update map center dynamically
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapComponent = ({ coordinates }) => {
  if (
    !coordinates ||
    coordinates.length === 0 ||
    !isValidLatLng(
      coordinates[coordinates.length - 1]?.latitude,
      coordinates[coordinates.length - 1]?.longitude
    )
  ) {
    return <p className="text-center text-gray-500">Loading map data...</p>;
  }

  const latest = coordinates[coordinates.length - 1];
  const center = [latest.latitude, latest.longitude];

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden w-full h-[300px] md:h-[350px] lg:h-[400px]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <MapUpdater center={center} />
        {coordinates
          .filter((c) => isValidLatLng(c.latitude, c.longitude))
          .map((coord, index) => (
            <Marker key={index} position={[coord.latitude, coord.longitude]}>
              <Popup>
                <div className="text-sm">
                  <p><strong>Temperature:</strong> {coord.temperature}°C</p>
                  <p><strong>Humidity:</strong> {coord.humidity}%</p>
                  <p><strong>Time:</strong>{" "}
                    {new Date(coord.timestamp).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

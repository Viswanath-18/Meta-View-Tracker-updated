import { useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";

function AutoCenter({ position }) {

  const map = useMap();

  useEffect(() => {

    if (position) {

      map.flyTo(position, 18, {
        duration: 1.5,
      });
    }

  }, [position, map]);

  return null;
}

function MapView({
  currentPosition,
  pathPositions,
  autoCenter,
}) {

  const defaultCenter = [11.0168, 76.9558];

  return (

    <MapContainer
      center={defaultCenter}
      zoom={15}
      scrollWheelZoom={true}
      className="w-full h-full rounded-[28px]"
    >

      {/* OpenStreetMap */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Drone Marker */}
      {currentPosition && (
        <Marker position={currentPosition} />
      )}

      {/* Flight Path */}
      {pathPositions.length > 0 && (
        <Polyline
          positions={pathPositions}
          pathOptions={{
            color: "#0f172a",
            weight: 4,
          }}
        />
      )}

      {/* Auto Center */}
      {autoCenter && currentPosition && (
        <AutoCenter position={currentPosition} />
      )}

    </MapContainer>
  );
}

export default MapView;
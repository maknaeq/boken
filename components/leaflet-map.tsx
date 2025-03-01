"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { Map } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

interface LeafletMapProps {
  locations: Location[];
}

export default function LeafletMap({ locations }: LeafletMapProps) {
  if (locations.length === 0)
    return (
      <div className="flex h-full w-full items-center justify-center gap-2 rounded-xl border border-dashed text-sm font-light text-zinc-500">
        <Map />
        <p>Ajoutez des étapes pour afficher la carte</p>
      </div>
    );

  const center: LatLngTuple = [locations[0].latitude, locations[0].longitude];

  // Icône personnalisée pour les marqueurs
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/64/252/252025.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Conversion des positions pour le Polyline
  const polylinePositions: LatLngExpression[] = locations.map((loc) => [
    loc.latitude,
    loc.longitude,
  ]);

  return (
    <MapContainer
      center={center}
      zoom={10}
      className="z-0 h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((loc, idx) => (
        <Marker
          key={idx}
          position={[loc.latitude, loc.longitude] as LatLngTuple}
          icon={customIcon}
        ></Marker>
      ))}

      <Polyline
        positions={polylinePositions}
        pathOptions={{ color: "blue", weight: 3, opacity: 0.7 }}
      />
    </MapContainer>
  );
}

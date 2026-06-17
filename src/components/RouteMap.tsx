"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Lucide-shaped SVG pin built inline so we don't ship marker images
function makeIcon(color: string) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <path filter="url(#s)" d="M18 1C9.7 1 3 7.7 3 16c0 11 15 27 15 27s15-16 15-27c0-8.3-6.7-15-15-15z"
            fill="${color}" stroke="#0c0a09" stroke-width="1.5"/>
      <circle cx="18" cy="16" r="5" fill="#0c0a09"/>
    </svg>
  `);
  return L.icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
  });
}

const ICON_PICKUP = makeIcon("#fde68a");
const ICON_DROPOFF = makeIcon("#ca8a04");

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 10, { animate: true });
    } else {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [points, map]);
  return null;
}

export type LatLng = [number, number];

export default function RouteMap({
  pickup,
  dropoff,
}: {
  pickup?: LatLng | null;
  dropoff?: LatLng | null;
}) {
  const initialCenter: LatLng = [39.0, 35.0]; // Türkiye centroid-ish
  const points = [pickup, dropoff].filter(Boolean) as LatLng[];
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-2xl"
    >
      <MapContainer
        center={initialCenter}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />
        {pickup ? <Marker position={pickup} icon={ICON_PICKUP} /> : null}
        {dropoff ? <Marker position={dropoff} icon={ICON_DROPOFF} /> : null}
        {pickup && dropoff ? (
          <Polyline
            positions={[pickup, dropoff]}
            pathOptions={{
              color: "#ca8a04",
              weight: 3,
              opacity: 0.9,
              dashArray: "6 8",
            }}
          />
        ) : null}
        <FitBounds points={points} />
      </MapContainer>
      {/* gold edge glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/20" />
    </div>
  );
}

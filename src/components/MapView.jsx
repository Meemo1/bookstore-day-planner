import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { stores, HOME } from '../data/stores';
import { saturdayStoreIds, sundayStoreIds, saturdayPolyline, sundayPolyline, ferryRoutes } from '../data/routes';

// Fix default leaflet icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function getStoreColor(store, visitedStores, activeDay, saturdayStoreIds, sundayStoreIds) {
  if (visitedStores.includes(store.id)) return '#16a34a'; // green
  if (activeDay === 'saturday' && saturdayStoreIds.includes(store.id)) return '#2563eb'; // blue
  if (activeDay === 'sunday' && sundayStoreIds.includes(store.id)) return '#7c3aed'; // purple
  if (activeDay === 'both') {
    if (saturdayStoreIds.includes(store.id)) return '#2563eb';
    if (sundayStoreIds.includes(store.id)) return '#7c3aed';
  }
  return '#9ca3af'; // gray - unplanned
}

function HomeMarker({ darkMode }) {
  const map = useMap();

  useEffect(() => {
    const marker = L.marker([HOME.lat, HOME.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;border-radius:50%;background:#8B2035;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;">🏠</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }),
    });
    marker.addTo(map);
    marker.bindPopup(`<b>Home</b><br>${HOME.address}`);
    return () => marker.remove();
  }, [map]);

  return null;
}

function FerryRoutes() {
  return (
    <>
      {ferryRoutes.map(route => (
        <Polyline
          key={route.id}
          positions={route.coords}
          pathOptions={{
            color: '#0891b2',
            weight: 3,
            dashArray: '10, 8',
            opacity: 0.8,
          }}
        />
      ))}
    </>
  );
}

export default function MapView({ visitedStores, activeDay, darkMode }) {
  const mapStyle = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = darkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const satLine = useMemo(() => saturdayPolyline, []);
  const sunLine = useMemo(() => sundayPolyline, []);

  return (
    <div className="relative">
      <MapContainer
        center={[47.65, -122.35]}
        zoom={11}
        style={{ height: '500px', width: '100%', borderRadius: '12px' }}
        className="z-0"
      >
        <TileLayer
          attribution={attribution}
          url={mapStyle}
        />

        {/* Saturday route polyline */}
        {(activeDay === 'saturday' || activeDay === 'both') && (
          <Polyline
            positions={satLine}
            pathOptions={{ color: '#2563eb', weight: 2.5, opacity: 0.7 }}
          />
        )}

        {/* Sunday route polyline */}
        {(activeDay === 'sunday' || activeDay === 'both') && (
          <Polyline
            positions={sunLine}
            pathOptions={{ color: '#7c3aed', weight: 2.5, opacity: 0.7 }}
          />
        )}

        {/* Ferry routes */}
        <FerryRoutes />

        {/* Home marker */}
        <HomeMarker darkMode={darkMode} />

        {/* Store markers */}
        {stores.map(store => {
          const color = getStoreColor(store, visitedStores, activeDay, saturdayStoreIds, sundayStoreIds);
          const isVisited = visitedStores.includes(store.id);
          const radius = isVisited ? 10 : 9;

          // Skip contingency (third place duplicates) - show them gray
          return (
            <CircleMarker
              key={store.id}
              center={[store.lat, store.lng]}
              radius={radius}
              pathOptions={{
                color: 'white',
                weight: 2,
                fillColor: color,
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Georgia, serif', minWidth: '160px' }}>
                  <strong style={{ fontSize: '14px' }}>{store.name}</strong>
                  {store.new2026 && (
                    <span style={{ marginLeft: '6px', background: '#d1fae5', color: '#065f46', fontSize: '10px', padding: '1px 6px', borderRadius: '9999px' }}>
                      NEW 2026
                    </span>
                  )}
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    📍 {store.address}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    <strong>Sat IBD:</strong> {store.hours.sat_ibd}
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    <strong>Sun:</strong> {store.hours.sun}
                  </div>
                  {store.region && (
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      {store.region}
                    </div>
                  )}
                  {store.notes && (
                    <div style={{ fontSize: '11px', color: '#b45309', marginTop: '4px', background: '#fef3c7', padding: '3px 6px', borderRadius: '4px' }}>
                      ⚠️ {store.notes}
                    </div>
                  )}
                  {isVisited && (
                    <div style={{ marginTop: '6px', color: '#16a34a', fontWeight: 'bold', fontSize: '12px' }}>
                      ✓ VISITED!
                    </div>
                  )}
                  {store.website && (
                    <a
                      href={`https://${store.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', marginTop: '6px', fontSize: '11px', color: '#2563eb' }}
                    >
                      🌐 {store.website}
                    </a>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className={`absolute bottom-4 left-4 z-10 rounded-lg p-3 shadow-lg text-xs ${
        darkMode ? 'bg-gray-800/95 text-gray-200' : 'bg-white/95 text-gray-700'
      }`}>
        <div className="font-semibold mb-1.5">Legend</div>
        {[
          { color: '#16a34a', label: 'Visited' },
          { color: '#2563eb', label: 'Saturday' },
          { color: '#7c3aed', label: 'Sunday' },
          { color: '#9ca3af', label: 'Contingency' },
          { color: '#8B2035', label: 'Home' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1">
          <div style={{ width: 24, height: 3, background: '#2563eb', borderRadius: 2, opacity: 0.7 }} />
          <span>Sat route</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 24, height: 3, background: '#7c3aed', borderRadius: 2, opacity: 0.7 }} />
          <span>Sun route</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 24, height: 3, background: '#0891b2', borderRadius: 2, borderTop: '2px dashed #0891b2', opacity: 0.8 }} />
          <span>Ferry</span>
        </div>
      </div>

      {/* Day filter */}
      <div className={`absolute top-4 right-4 z-10 flex flex-col gap-1.5 ${''}`}>
        {/* shown via parent props */}
      </div>
    </div>
  );
}

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { stores, HOME } from '../data/stores';
import { saturdayRoute, sundayRoute, saturdayStoreIds, sundayStoreIds, saturdayPolyline, sundayPolyline, ferryRoutes } from '../data/routes';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Precompute stop order per day
const satOrder = {};
let n = 0;
saturdayRoute.forEach(s => { if (s.type === 'store') { n++; satOrder[s.storeId] = n; } });
const sunOrder = {};
n = 0;
sundayRoute.forEach(s => { if (s.type === 'store') { n++; sunOrder[s.storeId] = n; } });

function getStoreColor(store, visitedStores, activeDay) {
  if (visitedStores.includes(store.id)) return '#16a34a';
  if (activeDay === 'saturday' && saturdayStoreIds.includes(store.id)) return '#2D5016';
  if (activeDay === 'sunday' && sundayStoreIds.includes(store.id)) return '#8B2035';
  if (activeDay === 'both') {
    if (saturdayStoreIds.includes(store.id)) return '#2D5016';
    if (sundayStoreIds.includes(store.id)) return '#8B2035';
  }
  return '#9ca3af';
}

function makeMarkerIcon(label, color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px; height:28px; border-radius:50%;
      border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.4);
      display:flex; align-items:center; justify-content:center;
      font-size:10px; font-weight:700; color:white; line-height:1;
      background:${color};
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function FitBounds({ activeDay }) {
  const map = useMap();

  useEffect(() => {
    const filtered = stores.filter(s => {
      if (activeDay === 'saturday') return saturdayStoreIds.includes(s.id);
      if (activeDay === 'sunday') return sundayStoreIds.includes(s.id);
      return true;
    });
    if (filtered.length === 0) return;
    const bounds = filtered.map(s => [s.lat, s.lng]);
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [activeDay, map]);

  return null;
}

function HomeMarker() {
  const map = useMap();

  useEffect(() => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:32px; height:32px; border-radius:50%;
        background:#6B1828; border:2px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
        display:flex; align-items:center; justify-content:center;
        font-size:16px;
      ">🏠</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    const marker = L.marker([HOME.lat, HOME.lng], { icon });
    marker.addTo(map);
    marker.bindPopup(`<strong style="color:#2D5016">Home</strong><br><span style="color:#6b7280;font-size:12px">${HOME.address}</span>`);
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
          pathOptions={{ color: '#B5763A', weight: 3, dashArray: '10, 8', opacity: 0.8 }}
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
        <TileLayer attribution={attribution} url={mapStyle} />
        <FitBounds activeDay={activeDay} />

        {(activeDay === 'saturday' || activeDay === 'both') && (
          <Polyline positions={satLine} pathOptions={{ color: '#2D5016', weight: 2.5, opacity: 0.7 }} />
        )}
        {(activeDay === 'sunday' || activeDay === 'both') && (
          <Polyline positions={sunLine} pathOptions={{ color: '#8B2035', weight: 2.5, opacity: 0.7 }} />
        )}

        <FerryRoutes />
        <HomeMarker />

        {stores.map(store => {
          const color = getStoreColor(store, visitedStores, activeDay);
          const isVisited = visitedStores.includes(store.id);

          const stopNum = activeDay === 'saturday' ? satOrder[store.id] :
            activeDay === 'sunday' ? sunOrder[store.id] :
            satOrder[store.id] || sunOrder[store.id];

          const label = isVisited ? '✓' : (stopNum ? String(stopNum) : '·');
          const icon = makeMarkerIcon(label, color);

          return (
            <Marker key={store.id} position={[store.lat, store.lng]} icon={icon}>
              <Popup>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minWidth: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14px', color: '#2D5016' }}>{store.name}</strong>
                    {store.new2026 && (
                      <span style={{ background: '#2D5016', color: 'white', fontSize: '9px', padding: '1px 5px', borderRadius: '9999px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{store.address}</div>
                  <div style={{ fontSize: '12px', color: '#374151', marginTop: '4px' }}>
                    <strong>Sat:</strong> {store.hours.sat_ibd}
                    {' · '}
                    <strong>Sun:</strong> {store.hours.sun}
                  </div>
                  {store.notes && (
                    <div style={{ fontSize: '11px', color: '#8B2035', marginTop: '4px', background: '#FDF8F0', padding: '3px 6px', borderRadius: '4px', border: '1px solid #e8c9d0' }}>
                      {store.notes}
                    </div>
                  )}
                  {isVisited && (
                    <div style={{ marginTop: '6px', color: '#2D5016', fontWeight: 'bold', fontSize: '12px' }}>
                      ✓ Visited
                    </div>
                  )}
                  {store.website && (
                    <a
                      href={`https://${store.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', marginTop: '6px', fontSize: '11px', color: '#2D5016' }}
                    >
                      {store.website}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className={`absolute bottom-4 left-4 z-10 rounded-lg p-3 shadow-lg text-xs ${
        darkMode ? 'bg-gray-800/95 text-gray-200' : 'bg-white/95 text-gray-700'
      }`}>
        <div className="font-semibold mb-1.5">Legend</div>
        {[
          { color: '#16a34a', label: 'Visited' },
          { color: '#2D5016', label: 'Saturday' },
          { color: '#8B2035', label: 'Sunday' },
          { color: '#9ca3af', label: 'Not on route' },
          { color: '#6B1828', label: 'Home' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1">
          <div style={{ width: 24, height: 3, background: '#2D5016', borderRadius: 2, opacity: 0.7 }} />
          <span>Sat route</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 24, height: 3, background: '#8B2035', borderRadius: 2, opacity: 0.7 }} />
          <span>Sun route</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 24, height: 0, borderTop: '3px dashed #B5763A', opacity: 0.8 }} />
          <span>Ferry</span>
        </div>
      </div>
    </div>
  );
}

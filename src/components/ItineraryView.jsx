import { useState, useEffect } from 'react';
import { saturdayRoute, sundayRoute } from '../data/routes';
import { getStoreById, stores, plannedStoreIds } from '../data/stores';
import StopCard from './StopCard';
import FerryCard from './FerryCard';

function LiveClock({ darkMode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;

  return (
    <div className={`flex items-center gap-2 text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
      <span className="font-semibold">{h}:{minutes}:{seconds} {ampm}</span>
    </div>
  );
}

const TRIP_SAT = new Date(2026, 3, 25);
const TRIP_SUN = new Date(2026, 3, 26);

function isTripDay(day) {
  const now = new Date();
  const d = day === 'sunday' ? TRIP_SUN : TRIP_SAT;
  return now.getFullYear() === d.getFullYear() &&
    now.getMonth() === d.getMonth() &&
    now.getDate() === d.getDate();
}

function ScheduleDelta({ stop, activeDay, darkMode }) {
  const [delta, setDelta] = useState(null);

  useEffect(() => {
    if (!isTripDay(activeDay)) return;
    const update = () => {
      const now = new Date();
      const currentMins = now.getHours() * 60 + now.getMinutes();
      setDelta(currentMins - stop.timeMinutes);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [stop.timeMinutes, activeDay]);

  if (delta === null) return null;
  if (Math.abs(delta) < 3) return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-forest/10 text-forest dark:bg-forest/20 dark:text-green-400">
      On time
    </span>
  );
  if (delta > 0) return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${
      delta > 30
        ? 'bg-burgundy/10 text-burgundy dark:bg-burgundy/20 dark:text-red-400'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    }`}>
      +{delta} min
    </span>
  );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-forest dark:bg-forest/20 dark:text-green-400">
      {delta} min (early!)
    </span>
  );
}

function MealCard({ stop, darkMode }) {
  return (
    <div className={`rounded-xl p-4 border-2 border-dashed ${
      darkMode ? 'border-amber-700 bg-amber-900/10' : 'border-amber-400 bg-amber-50'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍽️</span>
        <div>
          <div className={`font-bold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
            {stop.time} — {stop.label}
          </div>
          <div className={`text-sm ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
            {stop.description}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransitCard({ stop, darkMode }) {
  return (
    <div className={`rounded-xl p-3 border ${
      darkMode ? 'border-gray-700 bg-gray-800/60' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">🚗</span>
        <div>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {stop.time} — {stop.label}
          </span>
          {stop.description && (
            <span className={`ml-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {stop.description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function HomeCard({ stop, darkMode }) {
  return (
    <div className={`rounded-xl p-4 border-2 ${
      darkMode ? 'border-burgundy bg-burgundy/10' : 'border-burgundy bg-red-50'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏠</span>
        <div className="flex-1">
          <div className={`font-bold ${darkMode ? 'text-red-300' : 'text-burgundy'}`}>
            {stop.time} — Home!
          </div>
          <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You made it! Time to rest (and sort your book haul)
          </div>
        </div>
        {stop.directionUrl && (
          <a
            href={stop.directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-colors"
          >
            🚗 Home
          </a>
        )}
      </div>
    </div>
  );
}

function ContingencyTab({ visitedStores, skippedStores, contingencyStores, notes, onMarkVisited, onUnmarkVisited, onSetNote, darkMode }) {
  // Stores not on either day's route
  const { saturdayStoreIds, sundayStoreIds } = contingencyStores;
  const allUnplanned = stores.filter(s =>
    !saturdayStoreIds.includes(s.id) && !sundayStoreIds.includes(s.id) && !skippedStores.includes(s.id)
  );
  const skipped = stores.filter(s => skippedStores.includes(s.id));

  return (
    <div className="space-y-4">
      {skipped.length > 0 && (
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Skipped Stores ({skipped.length})
          </h3>
          <div className="space-y-2">
            {skipped.map(store => (
              <div key={store.id} className={`rounded-xl p-4 border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-cream-200 bg-cream-50'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {store.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {store.address}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      Sat: {store.hours.sat_ibd} · Sun: {store.hours.sun}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onMarkVisited(store.id)}
                      className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-forest hover:bg-forest-light transition-colors"
                    >
                      ✓ Visited
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Third Place Alternatives
        </h3>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'} italic`}>
          You only need to visit ONE Third Place Books location. Third Place Ravenna is on the Saturday route.
        </p>
        {stores.filter(s => s.thirdPlace && s.id !== 'thirdplaceravenna').map(store => (
          <div key={store.id} className={`rounded-xl p-4 border mb-2 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-cream-200 bg-cream-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {store.name}
                </div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {store.address}
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Sat IBD: {store.hours.sat_ibd}
                </div>
                {store.notes && (
                  <div className={`text-xs mt-1 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {store.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ItineraryView({
  activeDay,
  setActiveDay,
  visitedStores,
  skippedStores,
  notes,
  onMarkVisited,
  onUnmarkVisited,
  onSkip,
  onUnskip,
  onSetNote,
  darkMode,
}) {
  const route = activeDay === 'saturday' ? saturdayRoute : sundayRoute;

  // Determine "current" stop: next unvisited store stop
  const currentStop = activeDay !== 'contingency'
    ? route.find(s => s.type === 'store' && !visitedStores.includes(s.storeId) && !skippedStores.includes(s.storeId))
    : null;

  let storeCount = 0;

  const { saturdayStoreIds, sundayStoreIds } = {
    saturdayStoreIds: saturdayRoute.filter(s => s.type === 'store').map(s => s.storeId),
    sundayStoreIds: sundayRoute.filter(s => s.type === 'store').map(s => s.storeId),
  };

  const tabs = [
    { id: 'saturday', label: 'Saturday Apr 25', emoji: '⛴️' },
    { id: 'sunday', label: 'Sunday Apr 26', emoji: '📚' },
    { id: 'contingency', label: 'Contingency', emoji: '🗂️' },
  ];

  return (
    <div>
      {/* Tab navigation */}
      <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-4 overflow-x-auto`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveDay(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors border-b-2 ${
              activeDay === tab.id
                ? darkMode
                  ? 'border-green-500 text-green-400'
                  : 'border-forest text-forest'
                : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center pr-2">
          <LiveClock darkMode={darkMode} />
        </div>
      </div>

      {/* Contingency tab */}
      {activeDay === 'contingency' ? (
        <ContingencyTab
          visitedStores={visitedStores}
          skippedStores={skippedStores}
          contingencyStores={{ saturdayStoreIds, sundayStoreIds }}
          notes={notes}
          onMarkVisited={onMarkVisited}
          onUnmarkVisited={onUnmarkVisited}
          onSetNote={onSetNote}
          darkMode={darkMode}
        />
      ) : (
        <div className="space-y-3">
          {route.map((stop, idx) => {
            if (stop.type === 'store') {
              storeCount++;
              const isCurrent = currentStop?.id === stop.id;
              return (
                <div key={stop.id}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-semibold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Stop {storeCount}
                    </span>
                    {isCurrent && (
                      <ScheduleDelta stop={stop} activeDay={activeDay} darkMode={darkMode} />
                    )}
                  </div>
                  <StopCard
                    stop={stop}
                    stopNumber={storeCount}
                    activeDay={activeDay}
                    isVisited={visitedStores.includes(stop.storeId)}
                    isSkipped={skippedStores.includes(stop.storeId)}
                    isCurrent={isCurrent}
                    onMarkVisited={onMarkVisited}
                    onUnmarkVisited={onUnmarkVisited}
                    onSkip={onSkip}
                    onUnskip={onUnskip}
                    note={notes[stop.storeId] || ''}
                    onSetNote={onSetNote}
                    darkMode={darkMode}
                  />
                </div>
              );
            } else if (stop.type === 'ferry' || stop.type === 'ferry-warning' || stop.type === 'depart') {
              return <FerryCard key={stop.id} stop={stop} activeDay={activeDay} darkMode={darkMode} />;
            } else if (stop.type === 'meal') {
              return <MealCard key={stop.id} stop={stop} darkMode={darkMode} />;
            } else if (stop.type === 'transit') {
              return <TransitCard key={stop.id} stop={stop} darkMode={darkMode} />;
            } else if (stop.type === 'home') {
              return <HomeCard key={stop.id} stop={stop} darkMode={darkMode} />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

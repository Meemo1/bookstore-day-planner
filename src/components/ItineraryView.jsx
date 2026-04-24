import { useState, useEffect } from 'react';
import { Ship, BookOpen, Folder, Utensils, Car, Home, Check } from 'lucide-react';
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
    <div className={`flex items-center gap-2 text-sm font-mono ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
      <span className="w-2 h-2 rounded-full bg-teal animate-pulse inline-block" />
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
    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-tint text-teal">
      On time
    </span>
  );
  if (delta > 0) return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${
      delta > 30
        ? 'bg-amber-tint text-amber-dark border border-amber-border'
        : 'bg-amber-tint text-amber'
    }`}>
      +{delta} min
    </span>
  );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-tint text-teal">
      {delta} min (early!)
    </span>
  );
}

function MealCard({ stop, darkMode }) {
  return (
    <div className={`rounded-xl p-4 border-2 border-dashed ${
      darkMode ? 'border-amber-border/60 bg-amber/10' : 'border-amber-border bg-amber-tint'
    }`}>
      <div className="flex items-center gap-3">
        <Utensils size={22} strokeWidth={1.5} className={darkMode ? 'text-amber' : 'text-amber-dark'} />
        <div>
          <div className={`font-bold ${darkMode ? 'text-amber' : 'text-amber-dark'}`}>
            {stop.time} — {stop.label}
          </div>
          <div className={`text-sm ${darkMode ? 'text-[#A8906A]' : 'text-amber-dark'}`}>
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
      darkMode ? 'border-navy-border bg-navy-deep/60' : 'border-cream-border bg-cream-page'
    }`}>
      <div className="flex items-center gap-2">
        <Car size={16} strokeWidth={1.5} className={darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'} />
        <div>
          <span className={`text-sm font-medium ${darkMode ? 'text-cream-border' : 'text-ink-700'}`}>
            {stop.time} — {stop.label}
          </span>
          {stop.description && (
            <span className={`ml-2 text-xs ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
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
      darkMode ? 'bg-navy-raised border-navy-border' : 'bg-navy border-navy-light'
    }`}>
      <div className="flex items-center gap-3">
        <Home size={22} strokeWidth={1.5} className="text-white" />
        <div className="flex-1">
          <div className="font-bold text-white">
            {stop.time} — Home!
          </div>
          <div className="text-xs mt-0.5 text-white/60">
            You made it! Time to rest (and sort your book haul)
          </div>
        </div>
        {stop.directionUrl && (
          <a
            href={stop.directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-navy-light hover:bg-navy-hover transition-colors flex items-center gap-1"
          >
            <Car size={12} strokeWidth={2} />
            Home
          </a>
        )}
      </div>
    </div>
  );
}

function ContingencyTab({ visitedStores, skippedStores, contingencyStores, notes, onMarkVisited, onUnmarkVisited, onSetNote, darkMode }) {
  const { saturdayStoreIds, sundayStoreIds } = contingencyStores;
  const allUnplanned = stores.filter(s =>
    !saturdayStoreIds.includes(s.id) && !sundayStoreIds.includes(s.id) && !skippedStores.includes(s.id)
  );
  const skipped = stores.filter(s => skippedStores.includes(s.id));

  return (
    <div className="space-y-4">
      {skipped.length > 0 && (
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
            Skipped Stores ({skipped.length})
          </h3>
          <div className="space-y-2">
            {skipped.map(store => (
              <div key={store.id} className={`rounded-xl p-4 border ${darkMode ? 'border-navy-border bg-navy-deep' : 'border-cream-border bg-cream-white'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-cream-border' : 'text-ink-900'}`}>
                      {store.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
                      {store.address}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
                      Sat: {store.hours.sat_ibd} · Sun: {store.hours.sun}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onMarkVisited(store.id)}
                      className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-navy-light hover:bg-navy-hover transition-colors flex items-center gap-1"
                    >
                      <Check size={12} strokeWidth={2.5} />
                      Visited
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
          Third Place Alternatives
        </h3>
        <p className={`text-sm mb-3 italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
          You only need to visit ONE Third Place Books location. Third Place Ravenna is on the Saturday route.
        </p>
        {stores.filter(s => s.thirdPlace && s.id !== 'thirdplaceravenna').map(store => (
          <div key={store.id} className={`rounded-xl p-4 border mb-2 ${darkMode ? 'border-navy-border bg-navy-deep' : 'border-cream-border bg-cream-white'}`}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className={`font-semibold ${darkMode ? 'text-cream-border' : 'text-ink-900'}`}>
                  {store.name}
                </div>
                <div className={`text-xs mt-0.5 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
                  {store.address}
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
                  Sat IBD: {store.hours.sat_ibd}
                </div>
                {store.notes && (
                  <div className={`text-xs mt-1 italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
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

  const currentStop = activeDay !== 'contingency'
    ? route.find(s => s.type === 'store' && !visitedStores.includes(s.storeId) && !skippedStores.includes(s.storeId))
    : null;

  let storeCount = 0;

  const { saturdayStoreIds, sundayStoreIds } = {
    saturdayStoreIds: saturdayRoute.filter(s => s.type === 'store').map(s => s.storeId),
    sundayStoreIds: sundayRoute.filter(s => s.type === 'store').map(s => s.storeId),
  };

  const tabs = [
    { id: 'saturday', label: 'Saturday Apr 25', Icon: Ship },
    { id: 'sunday', label: 'Sunday Apr 26', Icon: BookOpen },
    { id: 'contingency', label: 'Contingency', Icon: Folder },
  ];

  return (
    <div>
      {/* Tab navigation */}
      <div className={`flex border-b ${darkMode ? 'border-navy-border' : 'border-cream-border'} mb-4 overflow-x-auto`}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveDay(id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors border-b-2 ${
              activeDay === id
                ? 'border-navy-light text-navy-light font-semibold'
                : `border-transparent ${darkMode ? 'text-[#6A7A8A] hover:text-cream-border' : 'text-ink-500 hover:text-ink-900'}`
            }`}
          >
            <Icon size={14} strokeWidth={2} />
            <span>{label}</span>
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
                    <span className={`text-xs font-semibold ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
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

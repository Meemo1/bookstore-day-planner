import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAppState } from './hooks/useAppState';
import ItineraryView from './components/ItineraryView';
import MapView from './components/MapView';
import WishlistView from './components/WishlistView';
import HaulView from './components/HaulView';
import { saturdayRoute, sundayRoute } from './data/routes';
import { getStoreById, SATURDAY_DATE, SUNDAY_DATE } from './data/stores';

const MILESTONES = [10, 20, 30, 33];

const SECTIONS = [
  { id: 'route', label: 'Route' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'haul', label: 'Haul' },
];

function ResetConfirmModal({ onConfirm, onCancel, darkMode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className={`rounded-2xl p-6 max-w-sm w-full shadow-2xl ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-xl font-bold text-center mb-2">Reset All Progress?</h2>
        <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This will clear all visited stores, notes, wishlists, purchases, and skipped stores. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-colors ${
              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}

function StickyActionBar({ nextStop, activeDay, onMarkVisited, onSkip, darkMode }) {
  const store = nextStop ? getStoreById(nextStop.storeId) : null;

  if (!store) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t shadow-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-forest border-forest-dark'
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-3 text-center">
          <span className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-white'}`}>
            All stores visited — great work!
          </span>
        </div>
      </div>
    );
  }

  const dayKey = activeDay === 'saturday' ? 'sat_ibd' : 'sun';
  const hours = store.hours[dayKey] || store.hours.sat_ibd;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 border-t shadow-lg ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-forest border-forest-dark'
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-white truncate">{store.name}</div>
          <div className="text-xs text-white/70">
            {nextStop.time} · {hours}
            {nextStop.travelTime ? ` · ${nextStop.travelTime}` : ''}
          </div>
        </div>
        {nextStop.directionUrl && (
          <a
            href={nextStop.directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-colors whitespace-nowrap"
          >
            {nextStop.directionMode === 'walking' ? 'Walk' : 'Drive'}
          </a>
        )}
        <button
          onClick={() => onSkip(nextStop.storeId)}
          className="px-3 py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onMarkVisited(nextStop.storeId)}
          className="px-3 py-2 rounded-lg text-xs font-bold bg-white text-forest hover:bg-white/90 transition-colors"
        >
          ✓ Visited
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const {
    visitedStores,
    skippedStores,
    notes,
    activeDay,
    activeView,
    activeSection,
    darkMode,
    wishlists,
    purchases,
    markVisited,
    unmarkVisited,
    skipStore,
    unskipStore,
    setNote,
    setActiveDay,
    setActiveView,
    setActiveSection,
    toggleDarkMode,
    resetAll,
    importProgress,
    exportProgress,
    addWishlistItem,
    toggleWishlistItem,
    removeWishlistItem,
    addPurchase,
    removePurchase,
    totalPlanned,
    getNextStore,
  } = useAppState();

  const [showResetModal, setShowResetModal] = useState(false);
  const [mapDayFilter, setMapDayFilter] = useState('both');
  const importInputRef = useRef(null);
  const prevVisitedCountRef = useRef(visitedStores.length);

  const currentRoute = activeDay === 'saturday' ? saturdayRoute :
    activeDay === 'sunday' ? sundayRoute : [];
  const nextStop = activeDay !== 'contingency' ? getNextStore(currentRoute) : null;
  const visitedCount = visitedStores.length;
  const pct = Math.round((visitedCount / totalPlanned) * 100);

  // Confetti on milestones
  useEffect(() => {
    const prev = prevVisitedCountRef.current;
    prevVisitedCountRef.current = visitedCount;
    const hit = MILESTONES.find(m => prev < m && visitedCount >= m);
    if (!hit) return;
    const isFinal = hit === 33;
    confetti({
      particleCount: isFinal ? 200 : 100,
      spread: isFinal ? 120 : 80,
      origin: { y: 0.4 },
      colors: ['#2D5016', '#8B2035', '#FDF8F0', '#FFD700', '#3D6B1F'],
      gravity: isFinal ? 0.8 : 1,
      scalar: isFinal ? 1.4 : 1,
    });
    if (isFinal) {
      setTimeout(() => {
        confetti({ particleCount: 150, angle: 60, spread: 80, origin: { x: 0, y: 0.5 }, colors: ['#2D5016', '#8B2035', '#FFD700'] });
        confetti({ particleCount: 150, angle: 120, spread: 80, origin: { x: 1, y: 0.5 }, colors: ['#2D5016', '#8B2035', '#FFD700'] });
      }, 400);
    }
  }, [visitedCount]);

  const handleReset = () => { resetAll(); setShowResetModal(false); };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!importProgress(evt.target.result)) {
        alert("Could not read backup file — make sure it's a valid IBD progress export.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const showStickyBar = activeSection === 'route' && activeDay !== 'contingency';

  // Wishlist badge counts for header
  const wishlistTotal = (wishlists.emily?.length || 0) + (wishlists.iris?.length || 0);
  const wishlistFound = (wishlists.emily?.filter(i => i.gotIt).length || 0) + (wishlists.iris?.filter(i => i.gotIt).length || 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-cream-100 text-gray-900'
    }`}>
      {/* Compact sticky header */}
      <header className={`sticky top-0 z-40 shadow-sm ${
        darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-forest'
      }`}>
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
          {/* Row 1: title + dark mode */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-base font-bold text-white font-serif-display tracking-tight">
                IBD 2026 Route Planner
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                {activeSection === 'route' && `${visitedCount} of ${totalPlanned} stores · Apr 25–26`}
                {activeSection === 'wishlist' && (wishlistTotal > 0
                  ? `${wishlistFound} of ${wishlistTotal} found`
                  : 'Apr 25–26')}
                {activeSection === 'haul' && `${Object.values(purchases).flat().length} items purchased`}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Row 2: section tabs */}
          <div className={`flex gap-1 mb-2 rounded-lg p-0.5 ${darkMode ? 'bg-gray-700/50' : 'bg-black/10'}`}>
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeSection === id
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Row 3: progress bar (Route only) */}
          {activeSection === 'route' && (
            <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white/20'}`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  visitedCount === totalPlanned ? 'bg-yellow-400' : 'bg-white/80'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
      </header>

      <main className={`max-w-2xl mx-auto px-4 py-4 space-y-4 ${showStickyBar ? 'pb-24' : 'pb-6'}`}>

        {/* ── Route section ── */}
        {activeSection === 'route' && (
          <>
            {/* List / Map sub-toggle */}
            <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              {[
                { id: 'itinerary', label: 'List' },
                { id: 'map', label: 'Map' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeView === v.id
                      ? darkMode ? 'bg-gray-700 text-green-400 shadow' : 'bg-forest text-white shadow'
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {activeView === 'map' ? (
              <div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {[
                    { id: 'both', label: 'All Stores' },
                    { id: 'saturday', label: 'Saturday' },
                    { id: 'sunday', label: 'Sunday' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setMapDayFilter(f.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        mapDayFilter === f.id
                          ? 'bg-forest text-white'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <MapView
                  visitedStores={visitedStores}
                  activeDay={mapDayFilter}
                  darkMode={darkMode}
                />
              </div>
            ) : (
              <ItineraryView
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                visitedStores={visitedStores}
                skippedStores={skippedStores}
                notes={notes}
                onMarkVisited={markVisited}
                onUnmarkVisited={unmarkVisited}
                onSkip={skipStore}
                onUnskip={unskipStore}
                onSetNote={setNote}
                darkMode={darkMode}
              />
            )}

            {/* Data management */}
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Data
              </h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={exportProgress}
                  className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    darkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-cream-100 text-gray-700 hover:bg-cream-200 border border-cream-200'
                  }`}
                >
                  Export
                </button>
                <input
                  type="file"
                  accept=".json"
                  ref={importInputRef}
                  className="hidden"
                  onChange={handleImport}
                />
                <button
                  onClick={() => importInputRef.current?.click()}
                  className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    darkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-cream-100 text-gray-700 hover:bg-cream-200 border border-cream-200'
                  }`}
                >
                  Import
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    darkMode
                      ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Reset
                </button>
              </div>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'} italic`}>
                Saved automatically. Export a backup before switching devices.
              </p>
            </div>

            <div className={`text-center text-xs py-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {SATURDAY_DATE} &amp; {SUNDAY_DATE}
            </div>
          </>
        )}

        {/* ── Wishlist section ── */}
        {activeSection === 'wishlist' && (
          <WishlistView
            wishlists={wishlists}
            onAdd={addWishlistItem}
            onToggle={toggleWishlistItem}
            onRemove={removeWishlistItem}
            darkMode={darkMode}
          />
        )}

        {/* ── Haul section ── */}
        {activeSection === 'haul' && (
          <HaulView
            purchases={purchases}
            visitedStores={visitedStores}
            onAdd={addPurchase}
            onRemove={removePurchase}
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Sticky bottom action bar — Route section only */}
      {showStickyBar && (
        <StickyActionBar
          nextStop={nextStop}
          activeDay={activeDay}
          onMarkVisited={markVisited}
          onSkip={skipStore}
          darkMode={darkMode}
        />
      )}

      {showResetModal && (
        <ResetConfirmModal
          onConfirm={handleReset}
          onCancel={() => setShowResetModal(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

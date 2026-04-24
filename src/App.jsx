import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sun, Moon, Check, Navigation } from 'lucide-react';
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
        darkMode ? 'bg-navy-deep text-cream-border' : 'bg-white text-ink-900'
      }`}>
        <h2 className="text-xl font-bold text-center mb-2">Reset All Progress?</h2>
        <p className={`text-sm text-center mb-6 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
          This will clear all visited stores, notes, wishlists, purchases, and skipped stores. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-colors ${
              darkMode ? 'border-navy-border text-[#A8906A] hover:bg-navy-raised' : 'border-cream-border text-ink-500 hover:bg-cream-page'
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
        darkMode ? 'bg-navy-deep border-navy-border' : 'bg-navy border-navy/80'
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-3 text-center">
          <span className="text-sm font-semibold text-white">
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
      darkMode ? 'bg-navy-deep border-navy-border' : 'bg-white border-cream-border'
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm truncate ${darkMode ? 'text-cream-border' : 'text-ink-900'}`}>
            {store.name}
          </div>
          <div className={`text-xs ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
            {nextStop.time} · {hours}
            {nextStop.travelTime ? ` · ${nextStop.travelTime}` : ''}
          </div>
        </div>
        {nextStop.directionUrl && (
          <a
            href={nextStop.directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-xs font-bold bg-navy-light hover:bg-navy-hover text-white transition-colors whitespace-nowrap"
          >
            {nextStop.directionMode === 'walking' ? 'Walk' : 'Drive'}
          </a>
        )}
        <button
          onClick={() => onSkip(nextStop.storeId)}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
            darkMode ? 'bg-navy-raised text-[#A8906A] hover:bg-navy-border' : 'bg-cream-page text-ink-500 hover:bg-cream-border'
          }`}
        >
          Skip
        </button>
        <button
          onClick={() => onMarkVisited(nextStop.storeId)}
          className="px-3 py-2 rounded-lg text-xs font-bold bg-navy-light hover:bg-navy-hover text-white transition-colors active:scale-[0.97] flex items-center gap-1"
        >
          <Check size={12} strokeWidth={2.5} />
          Visited
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
      colors: ['#1B3A5C', '#D4A030', '#FDF8F0', '#C4752A', '#2860A0'],
      gravity: isFinal ? 0.8 : 1,
      scalar: isFinal ? 1.4 : 1,
    });
    if (isFinal) {
      setTimeout(() => {
        confetti({ particleCount: 150, angle: 60, spread: 80, origin: { x: 0, y: 0.5 }, colors: ['#1B3A5C', '#D4A030', '#C4752A'] });
        confetti({ particleCount: 150, angle: 120, spread: 80, origin: { x: 1, y: 0.5 }, colors: ['#1B3A5C', '#D4A030', '#C4752A'] });
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
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'text-cream-border' : 'text-ink-900'
      }`}
      style={darkMode ? {
        backgroundColor: '#0E1A27',
        backgroundImage: 'linear-gradient(rgba(14,26,39,0.93),rgba(14,26,39,0.93)),url(/ibd-logo-2026.png)',
        backgroundRepeat: 'no-repeat,repeat',
        backgroundSize: 'cover,180px',
      } : {
        backgroundColor: '#FDF8F0',
        backgroundImage: 'linear-gradient(rgba(253,248,240,0.93),rgba(253,248,240,0.93)),url(/ibd-logo-2026.png)',
        backgroundRepeat: 'no-repeat,repeat',
        backgroundSize: 'cover,180px',
      }}
    >
      {/* Compact sticky header */}
      <header className={`sticky top-0 z-40 shadow-sm transition-colors duration-300 ${
        darkMode ? 'bg-navy-deep border-b border-navy-border' : 'bg-navy'
      }`}>
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
          {/* Row 1: title + dark mode */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1
                className="text-[26px] font-bold text-white font-display tracking-tight leading-tight"
                style={{ fontVariationSettings: "'opsz' 72" }}
              >
                IBD 2026 Route Planner
              </h1>
              <p className="text-xs text-white/50 mt-0.5">
                {activeSection === 'route' && `${visitedCount} of ${totalPlanned} stores · Apr 25–26`}
                {activeSection === 'wishlist' && (wishlistTotal > 0
                  ? `${wishlistFound} of ${wishlistTotal} found`
                  : 'Apr 25–26')}
                {activeSection === 'haul' && `${Object.values(purchases).flat().length} items purchased`}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
            </button>
          </div>

          {/* Row 2: section tabs */}
          <div className={`flex gap-1 mb-2 rounded-lg p-0.5 ${darkMode ? 'bg-navy-border/50' : 'bg-black/10'}`}>
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeSection === id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Row 3: progress bar (Route only) */}
          {activeSection === 'route' && (
            <div className={`h-[3px] rounded-full overflow-hidden ${darkMode ? 'bg-navy-border' : 'bg-white/20'}`}>
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                  visitedCount === totalPlanned ? 'bg-gold' : 'bg-white/80'
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
            <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-navy-deep' : 'bg-white'} shadow-sm`}>
              {[
                { id: 'itinerary', label: 'List' },
                { id: 'map', label: 'Map' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeView === v.id
                      ? darkMode ? 'bg-navy-raised text-cream-border shadow' : 'bg-navy-light text-white shadow'
                      : darkMode ? 'text-[#6A7A8A] hover:text-cream-border' : 'text-ink-500 hover:text-ink-900'
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
                          ? 'bg-navy-light text-white'
                          : darkMode
                            ? 'bg-navy-raised text-[#A8906A] hover:bg-navy-border'
                            : 'bg-white text-ink-500 hover:bg-cream-page border border-cream-border'
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
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-navy-deep' : 'bg-white'} shadow-sm`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'
              }`}>
                Data
              </h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={exportProgress}
                  className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    darkMode
                      ? 'bg-navy-raised text-cream-border hover:bg-navy-border'
                      : 'bg-cream-page text-ink-700 hover:bg-cream-border border border-cream-border'
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
                      ? 'bg-navy-raised text-cream-border hover:bg-navy-border'
                      : 'bg-cream-page text-ink-700 hover:bg-cream-border border border-cream-border'
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
              <p className={`text-xs mt-2 italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
                Saved automatically. Export a backup before switching devices.
              </p>
            </div>

            <div className={`text-center text-xs py-2 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
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

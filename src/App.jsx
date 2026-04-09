import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import ProgressBar from './components/ProgressBar';
import NextStoreCard from './components/NextStoreCard';
import ItineraryView from './components/ItineraryView';
import MapView from './components/MapView';
import { saturdayRoute, sundayRoute } from './data/routes';
import { SATURDAY_DATE, SUNDAY_DATE } from './data/stores';

function ResetConfirmModal({ onConfirm, onCancel, darkMode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className={`rounded-2xl p-6 max-w-sm w-full shadow-2xl ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <div className="text-3xl text-center mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-center mb-2">Reset All Progress?</h2>
        <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This will clear all visited stores, notes, and skipped stores. This cannot be undone.
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

export default function App() {
  const {
    visitedStores,
    skippedStores,
    notes,
    activeDay,
    activeView,
    darkMode,
    markVisited,
    unmarkVisited,
    skipStore,
    unskipStore,
    setNote,
    setActiveDay,
    setActiveView,
    toggleDarkMode,
    resetAll,
    exportProgress,
    totalPlanned,
    getNextStore,
  } = useAppState();

  const [showResetModal, setShowResetModal] = useState(false);
  const [mapDayFilter, setMapDayFilter] = useState('both');

  const currentRoute = activeDay === 'saturday' ? saturdayRoute :
                       activeDay === 'sunday' ? sundayRoute : [];

  const nextStop = activeDay !== 'contingency' ? getNextStore(currentRoute) : null;
  const visitedCount = visitedStores.length;

  const handleReset = () => {
    resetAll();
    setShowResetModal(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-cream-100 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 shadow-sm ${
        darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-forest'
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white leading-tight font-serif-display tracking-tight">
                📚 IBD 2026 Route Planner
              </h1>
              <p className="text-xs text-green-200 mt-0.5">
                Apr 25–26 · Seattle Area · {totalPlanned} Stores
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Progress */}
        <ProgressBar visited={visitedCount} total={totalPlanned} darkMode={darkMode} />

        {/* View toggle */}
        <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {[
            { id: 'itinerary', label: '📋 Itinerary' },
            { id: 'map', label: '🗺️ Map' },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeView === view.id
                  ? darkMode
                    ? 'bg-gray-700 text-green-400 shadow'
                    : 'bg-forest text-white shadow'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Next Store Card (only in itinerary mode, not contingency) */}
        {activeView === 'itinerary' && activeDay !== 'contingency' && (
          <NextStoreCard nextStop={nextStop} activeDay={activeDay} darkMode={darkMode} />
        )}

        {/* Main content */}
        {activeView === 'map' ? (
          <div>
            {/* Map day filter */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {[
                { id: 'both', label: 'All Stores' },
                { id: 'saturday', label: '⛴️ Saturday' },
                { id: 'sunday', label: '📚 Sunday' },
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
          <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Data Management
          </h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={exportProgress}
              className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                darkMode
                  ? 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Export Progress
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                darkMode
                  ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Reset All
            </button>
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} italic`}>
            Progress is automatically saved in your browser.
          </p>
        </div>

        {/* Footer */}
        <div className={`text-center text-xs py-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          Independent Bookstore Day 2026 · Seattle Area<br />
          {SATURDAY_DATE} &amp; {SUNDAY_DATE}<br />
          <span className="mt-1 block">Happy reading! 📖</span>
        </div>
      </main>

      {/* Reset confirmation modal */}
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

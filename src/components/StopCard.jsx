import { useState } from 'react';
import { getStoreById } from '../data/stores';

export default function StopCard({
  stop,
  stopNumber,
  activeDay,
  isVisited,
  isSkipped,
  isCurrent,
  onMarkVisited,
  onUnmarkVisited,
  onSkip,
  onUnskip,
  note,
  onSetNote,
  darkMode,
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(note || '');

  const store = getStoreById(stop.storeId);
  if (!store) return null;

  const dayKey = activeDay === 'saturday' ? 'sat_ibd' : 'sun';
  const hours = store.hours[dayKey] || store.hours.sat_ibd;

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
    onSetNote(stop.storeId, e.target.value);
  };

  const cardClass = `stop-card rounded-xl border-2 p-4 transition-all duration-200 ${
    isVisited
      ? darkMode
        ? 'border-green-700 bg-green-900/20'
        : 'border-green-400 bg-green-50'
      : isSkipped
        ? darkMode
          ? 'border-gray-600 bg-gray-800/50 opacity-60'
          : 'border-gray-300 bg-gray-100 opacity-60'
        : isCurrent
          ? darkMode
            ? 'border-red-500 bg-red-900/20 shadow-lg shadow-red-900/30'
            : 'border-red-400 bg-red-50 shadow-lg shadow-red-100'
          : darkMode
            ? 'border-gray-700 bg-gray-800'
            : 'border-cream-200 bg-white'
  }`;

  return (
    <div className={cardClass}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Stop number badge */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
          isVisited
            ? 'bg-green-500 text-white'
            : isSkipped
              ? darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-500'
              : isCurrent
                ? 'bg-red-500 text-white animate-pulse'
                : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-cream-200 text-forest'
        }`}>
          {isVisited ? '✓' : stopNumber}
        </div>

        {/* Store info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-base leading-tight ${
              isVisited
                ? darkMode ? 'text-green-400 line-through' : 'text-green-700 line-through'
                : darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {store.name}
            </span>
            {store.new2026 && (
              <span className="bg-emerald-100 text-emerald-800 text-xs px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap dark:bg-emerald-900/40 dark:text-emerald-300">
                ✨ NEW
              </span>
            )}
            {store.thirdPlace && (
              <span className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap dark:bg-purple-900/40 dark:text-purple-300">
                3P
              </span>
            )}
            {store.timeSensitive && (
              <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap dark:bg-red-900/40 dark:text-red-300 animate-pulse">
                ⏰ CLOSES EARLY
              </span>
            )}
            {stop.lastStop && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap dark:bg-yellow-900/40 dark:text-yellow-300">
                🏁 LAST STOP
              </span>
            )}
          </div>

          <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            📍 {store.address}
          </div>

          <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs`}>
            <span className={darkMode ? 'text-cyan-400' : 'text-cyan-700'}>
              🕐 Arrive: <strong>{stop.time}</strong>
            </span>
            <span className={darkMode ? 'text-purple-400' : 'text-purple-700'}>
              🏪 Hours: {hours}
            </span>
          </div>

          {stop.travelTime && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {stop.directionMode === 'walking' ? '🚶' : '🚗'}
              <span>{stop.travelTime} from {stop.travelFrom}</span>
            </div>
          )}

          {store.notes && (
            <div className={`mt-1.5 text-xs px-2 py-1 rounded-lg ${
              store.timeSensitive
                ? darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                : darkMode ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'
            }`}>
              💡 {store.notes}
            </div>
          )}

          {isCurrent && !isVisited && (
            <div className="mt-1.5 inline-flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse">
              📍 YOU ARE HERE
            </div>
          )}
        </div>
      </div>

      {/* Notes section */}
      {showNotes && (
        <div className="mt-3">
          <textarea
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Add a note about this store..."
            className={`w-full text-sm p-2 rounded-lg border resize-none h-16 focus:outline-none focus:ring-2 focus:ring-forest ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-green-600'
                : 'bg-cream-50 border-gray-200 text-gray-800 placeholder-gray-400'
            }`}
          />
        </div>
      )}

      {/* Action buttons row */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {/* Website link */}
        {store.website && (
          <a
            href={`https://${store.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🌐 Website
          </a>
        )}

        {/* Directions */}
        {stop.directionUrl && (
          <a
            href={stop.directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
              stop.directionMode === 'walking'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-forest hover:bg-forest-light'
            }`}
          >
            {stop.directionMode === 'walking' ? '🚶 Walk' : '🚗 Drive'}
          </a>
        )}

        {/* Notes toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
            note
              ? darkMode ? 'border-yellow-600 text-yellow-400 bg-yellow-900/20' : 'border-yellow-400 text-yellow-700 bg-yellow-50'
              : darkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {note ? '📝 Note' : '📝 Notes'}
        </button>

        {/* Skip/unskip */}
        {!isVisited && (
          isSkipped ? (
            <button
              onClick={() => onUnskip(stop.storeId)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                darkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-400 text-gray-600 hover:bg-gray-50'
              }`}
            >
              ↩ Unskip
            </button>
          ) : (
            <button
              onClick={() => onSkip(stop.storeId)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                darkMode ? 'border-orange-700 text-orange-400 hover:bg-orange-900/20' : 'border-orange-300 text-orange-600 hover:bg-orange-50'
              }`}
            >
              ⏭ Skip
            </button>
          )
        )}

        {/* Mark visited / unmark */}
        <div className="flex-1 flex justify-end">
          {isVisited ? (
            <button
              onClick={() => onUnmarkVisited(stop.storeId)}
              className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                darkMode
                  ? 'border-green-600 text-green-400 hover:bg-green-900/30'
                  : 'border-green-500 text-green-700 hover:bg-green-50'
              }`}
            >
              ✓ Visited
            </button>
          ) : (
            <button
              onClick={() => onMarkVisited(stop.storeId)}
              disabled={isSkipped}
              className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors ${
                isSkipped
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-forest hover:bg-forest-light active:scale-95'
              }`}
            >
              Mark Visited
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

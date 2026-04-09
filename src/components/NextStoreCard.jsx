import { getStoreById } from '../data/stores';

export default function NextStoreCard({ nextStop, activeDay, darkMode }) {
  if (!nextStop) {
    return (
      <div className={`rounded-xl p-5 border-2 border-green-500 text-center ${
        darkMode ? 'bg-green-900/20' : 'bg-green-50'
      }`}>
        <div className="text-4xl mb-2">🎉</div>
        <div className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
          All stores on today's route visited!
        </div>
        <div className={`text-sm mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          Amazing work — hope you found some great books!
        </div>
      </div>
    );
  }

  const store = getStoreById(nextStop.storeId);
  if (!store) return null;

  const dayKey = activeDay === 'saturday' ? 'sat_ibd' : 'sun';
  const hours = store.hours[dayKey] || store.hours.sat_ibd;

  return (
    <div className={`rounded-xl p-4 border-2 ${
      darkMode
        ? 'border-burgundy bg-burgundy/10'
        : 'border-burgundy bg-red-50'
    } shadow-md`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
        darkMode ? 'text-red-400' : 'text-burgundy'
      }`}>
        Next Up
      </div>

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
          darkMode ? 'bg-burgundy/30' : 'bg-burgundy/10'
        }`}>
          📚
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-base ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {store.name}
          </div>
          <div className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {store.address}
          </div>
          <div className={`flex flex-wrap gap-x-4 mt-1 text-sm`}>
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
              Arrive <strong>{nextStop.time}</strong>
            </span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {hours}
            </span>
          </div>
          {nextStop.travelTime && (
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {nextStop.directionMode === 'walking' ? '🚶' : '🚗'} {nextStop.travelTime}
            </div>
          )}
          {store.timeSensitive && (
            <div className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">
              ⏰ TIME SENSITIVE — closes early!
            </div>
          )}
        </div>
      </div>

      {nextStop.directionUrl && (
        <a
          href={nextStop.directionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-base ${
            darkMode ? 'bg-burgundy hover:bg-burgundy-light' : 'bg-burgundy hover:bg-burgundy-light'
          } transition-colors active:scale-98`}
        >
          {nextStop.directionMode === 'walking' ? '🚶' : '🚗'} Get Directions
        </a>
      )}
    </div>
  );
}

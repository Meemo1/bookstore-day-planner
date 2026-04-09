import { useState, useEffect } from 'react';

function getMinutesUntil(timeStr) {
  // timeStr like "6:05 AM" or "11:05 AM"
  const now = new Date();
  const [timePart, ampm] = timeStr.split(' ');
  let [h, m] = timePart.split(':').map(Number);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  return Math.round((target - now) / 60000);
}

export default function FerryCard({ stop, darkMode }) {
  const [minutesUntil, setMinutesUntil] = useState(null);

  useEffect(() => {
    const update = () => {
      if (stop.departTime) {
        setMinutesUntil(getMinutesUntil(stop.departTime));
      }
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [stop.departTime]);

  const isLate = minutesUntil !== null && minutesUntil < 30 && minutesUntil > -10;
  const isVeryLate = minutesUntil !== null && minutesUntil < 10 && minutesUntil > -5;
  const hasDeparted = minutesUntil !== null && minutesUntil < -5;

  if (stop.type === 'ferry-warning') {
    return (
      <div className={`rounded-xl p-4 border-2 border-dashed ${
        isVeryLate
          ? 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-400'
          : 'bg-amber-50 border-amber-400 dark:bg-amber-900/20 dark:border-amber-500'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <div className={`font-bold text-sm ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
              {stop.time} — {stop.label}
            </div>
            <div className={`text-sm mt-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
              {stop.description}
            </div>
          </div>
          {stop.directionUrl && (
            <a
              href={stop.directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-2 rounded-lg text-xs font-semibold text-white ${
                darkMode ? 'bg-amber-700 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-700'
              } transition-colors`}
            >
              🚗 Go
            </a>
          )}
        </div>
      </div>
    );
  }

  if (stop.type === 'depart') {
    return (
      <div className={`rounded-xl p-4 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">🏠</span>
          <div className="flex-1">
            <div className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {stop.time} — {stop.label}
            </div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {stop.description}
            </div>
          </div>
          {stop.directionUrl && (
            <a
              href={stop.directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-colors"
            >
              🚗 Directions
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 border-2 ${
      hasDeparted
        ? `border-gray-400 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} opacity-60`
        : isVeryLate
          ? `border-red-500 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`
          : isLate
            ? `border-amber-500 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`
            : `border-cyan-500 ${darkMode ? 'bg-cyan-900/20' : 'bg-cyan-50'}`
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">⛴️</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-base ${
              isVeryLate ? 'text-red-600 dark:text-red-400' :
              isLate ? 'text-amber-700 dark:text-amber-400' :
              darkMode ? 'text-cyan-300' : 'text-cyan-800'
            }`}>
              {stop.label}
            </span>
            {stop.new2026 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                NEW 2026
              </span>
            )}
          </div>

          <div className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="font-semibold">{stop.ferryFrom}</span>
            <span className="mx-2">→</span>
            <span className="font-semibold">{stop.ferryTo}</span>
          </div>

          <div className={`flex gap-4 mt-2 text-sm flex-wrap ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Departs <strong>{stop.departTime}</strong></span>
            <span>{stop.duration} min crossing</span>
            <span>Arrives {stop.arriveTime}</span>
          </div>

          {stop.lineupBy && (
            <div className={`mt-2 text-sm font-semibold ${
              isVeryLate ? 'text-red-600 dark:text-red-400' :
              isLate ? 'text-amber-700 dark:text-amber-400' :
              darkMode ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              Line up by {stop.lineupBy}
            </div>
          )}

          {minutesUntil !== null && !hasDeparted && (
            <div className={`mt-2 px-3 py-1.5 rounded-lg inline-block text-sm font-bold ${
              isVeryLate
                ? 'bg-red-600 text-white animate-pulse'
                : isLate
                  ? 'bg-amber-500 text-white'
                  : darkMode ? 'bg-cyan-800 text-cyan-100' : 'bg-cyan-100 text-cyan-800'
            }`}>
              {minutesUntil <= 0
                ? 'Departing NOW!'
                : `Departs in ${minutesUntil} min`}
            </div>
          )}
          {hasDeparted && (
            <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
              Ferry has departed
            </div>
          )}

          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'} italic`}>
            {stop.description}
          </div>
        </div>
      </div>
    </div>
  );
}

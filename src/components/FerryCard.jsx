import { useState, useEffect } from 'react';
import { Ship, AlertTriangle, Home, Navigation } from 'lucide-react';

const TRIP_SAT = new Date(2026, 3, 25); // April 25, 2026
const TRIP_SUN = new Date(2026, 3, 26); // April 26, 2026

function getTripDate(day) {
  return day === 'sunday' ? TRIP_SUN : TRIP_SAT;
}

function isTripDay(day) {
  const now = new Date();
  const d = getTripDate(day);
  return now.getFullYear() === d.getFullYear() &&
    now.getMonth() === d.getMonth() &&
    now.getDate() === d.getDate();
}

function getMinutesUntil(timeStr, day) {
  const [timePart, ampm] = timeStr.split(' ');
  let [h, m] = timePart.split(':').map(Number);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  const tripDate = getTripDate(day);
  const target = new Date(tripDate);
  target.setHours(h, m, 0, 0);
  return Math.round((target - new Date()) / 60000);
}

export default function FerryCard({ stop, activeDay, darkMode }) {
  const [minutesUntil, setMinutesUntil] = useState(null);
  const onTripDay = isTripDay(activeDay || 'saturday');

  useEffect(() => {
    if (!onTripDay || !stop.departTime) return;
    const update = () => setMinutesUntil(getMinutesUntil(stop.departTime, activeDay || 'saturday'));
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [stop.departTime, activeDay, onTripDay]);

  const isLate = minutesUntil !== null && minutesUntil < 30 && minutesUntil > -10;
  const isVeryLate = minutesUntil !== null && minutesUntil < 10 && minutesUntil > -5;
  const hasDeparted = minutesUntil !== null && minutesUntil < -5;

  if (stop.type === 'ferry-warning') {
    return (
      <div className={`rounded-xl p-4 border-2 border-dashed ${
        isVeryLate
          ? darkMode ? 'bg-red-900/30 border-red-400' : 'bg-red-100 border-red-500'
          : darkMode ? 'bg-amber/10 border-amber-border' : 'bg-amber-tint border-amber-border'
      }`}>
        <div className="flex items-center gap-3">
          <AlertTriangle size={22} strokeWidth={1.5} className={isVeryLate ? 'text-red-500' : 'text-amber'} />
          <div className="flex-1">
            <div className={`font-bold text-sm ${isVeryLate ? 'text-red-600' : darkMode ? 'text-amber' : 'text-amber-dark'}`}>
              {stop.time} — {stop.label}
            </div>
            <div className={`text-sm mt-0.5 ${darkMode ? 'text-[#A8906A]' : 'text-amber-dark'}`}>
              {stop.description}
            </div>
          </div>
          {stop.directionUrl && (
            <a
              href={stop.directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-amber hover:bg-amber-dark transition-colors"
            >
              Go
            </a>
          )}
        </div>
      </div>
    );
  }

  if (stop.type === 'depart') {
    return (
      <div className={`rounded-xl p-4 border ${darkMode ? 'bg-navy-raised border-navy-border' : 'bg-cream-white border-cream-border'}`}>
        <div className="flex items-center gap-3">
          <Home size={20} strokeWidth={1.5} className={darkMode ? 'text-[#A8906A]' : 'text-ink-500'} />
          <div className="flex-1">
            <div className={`font-semibold text-sm ${darkMode ? 'text-cream-border' : 'text-ink-700'}`}>
              {stop.time} — {stop.label}
            </div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
              {stop.description}
            </div>
          </div>
          {stop.directionUrl && (
            <a
              href={stop.directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-navy-light hover:bg-navy-hover transition-colors flex items-center gap-1"
            >
              <Navigation size={12} strokeWidth={2} />
              Directions
            </a>
          )}
        </div>
      </div>
    );
  }

  // Main ferry card — keep ferry blue (#0891b2) as specified
  const borderColor = hasDeparted ? (darkMode ? 'border-navy-border' : 'border-cream-border') :
    isVeryLate ? 'border-red-500' :
    isLate ? 'border-amber' :
    'border-ferry';

  const bgColor = hasDeparted
    ? darkMode ? 'bg-navy-deep' : 'bg-cream-page'
    : isVeryLate
      ? darkMode ? 'bg-red-900/30' : 'bg-red-50'
      : isLate
        ? darkMode ? 'bg-amber/10' : 'bg-amber-tint'
        : darkMode ? 'bg-navy-raised' : 'bg-cream-white';

  return (
    <div className={`rounded-xl p-4 border-2 ${borderColor} ${bgColor} ${hasDeparted ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <Ship size={28} strokeWidth={1.5} className={
          isVeryLate ? 'text-red-500' :
          isLate ? 'text-amber' :
          'text-ferry'
        } />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-base ${
              isVeryLate ? 'text-red-600' :
              isLate ? 'text-amber font-bold' :
              'text-ferry'
            }`}>
              {stop.label}
            </span>
            {stop.new2026 && (
              <span className="bg-navy-light/10 text-navy-light text-xs px-2 py-0.5 rounded-full font-semibold">
                NEW 2026
              </span>
            )}
          </div>

          <div className={`text-sm mt-1 ${darkMode ? 'text-cream-border' : 'text-ink-700'}`}>
            <span className="font-semibold">{stop.ferryFrom}</span>
            <span className="mx-2">→</span>
            <span className="font-semibold">{stop.ferryTo}</span>
          </div>

          <div className={`flex gap-4 mt-2 text-sm flex-wrap ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
            <span>Departs <strong>{stop.departTime}</strong></span>
            <span>{stop.duration} min crossing</span>
            <span>Arrives {stop.arriveTime}</span>
          </div>

          {stop.lineupBy && (
            <div className={`mt-2 text-sm font-bold ${
              isVeryLate ? 'text-red-600' :
              isLate ? 'text-amber' :
              'text-amber'
            }`}>
              Line up by {stop.lineupBy}
            </div>
          )}

          {onTripDay && minutesUntil !== null && !hasDeparted && (
            <div className={`mt-2 px-3 py-1.5 rounded-lg inline-block text-sm font-bold ${
              isVeryLate
                ? 'bg-red-600 text-white animate-pulse'
                : isLate
                  ? 'bg-amber text-white'
                  : 'bg-ferry/10 text-ferry'
            }`}>
              {minutesUntil <= 0 ? 'Departing NOW!' : `Departs in ${minutesUntil} min`}
            </div>
          )}
          {onTripDay && hasDeparted && (
            <div className={`mt-2 text-sm italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
              Ferry has departed
            </div>
          )}

          <div className={`text-xs mt-2 italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
            {stop.description}
          </div>
        </div>
      </div>
    </div>
  );
}

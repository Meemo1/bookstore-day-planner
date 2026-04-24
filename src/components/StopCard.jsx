import { useState } from 'react';
import {
  Check, Navigation, Footprints, Info, Clock, MapPin,
  Pencil, Undo2, SkipForward,
} from 'lucide-react';
import { getStoreById } from '../data/stores';

function StoreThumbnail({ storeId, name, isVisited, isCurrent, darkMode }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  const ring = isVisited ? 'ring-2 ring-teal/40' : isCurrent ? 'ring-2 ring-amber/40' : '';
  const bg = darkMode ? 'bg-navy-raised' : 'bg-white';
  return (
    <div className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden ${ring} ${bg} border border-cream-border/50 flex items-center justify-center p-1`}>
      <img
        src={`/store-images/${storeId}.png`}
        alt={name}
        className="w-full h-full object-contain"
        onError={(e) => {
          // try .jpg fallback, then give up
          if (e.target.src.endsWith('.png')) {
            e.target.src = `/store-images/${storeId}.jpg`;
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}

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

  const cardClass = `stop-card rounded-xl p-4 transition-all duration-200 ${
    isVisited
      ? darkMode
        ? 'border-2 border-teal bg-teal/10'
        : 'border-2 border-teal bg-teal-tint'
      : isSkipped
        ? darkMode
          ? 'border border-navy-border bg-navy-deep/50 opacity-50'
          : 'border border-cream-border bg-cream-page opacity-50'
        : isCurrent
          ? 'border-2 border-amber bg-amber-tint shadow-md'
          : darkMode
            ? 'border border-navy-border bg-navy-deep'
            : 'border border-cream-border bg-cream-white'
  }`;

  return (
    <div className={cardClass}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Stop number badge */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
          isVisited
            ? 'bg-teal text-white'
            : isSkipped
              ? darkMode ? 'bg-navy-border text-[#6A7A8A]' : 'bg-cream-border text-ink-500'
              : isCurrent
                ? 'bg-amber text-white'
                : darkMode
                  ? 'bg-navy-raised text-navy-light'
                  : 'bg-cream-page text-navy-light'
        }`}>
          {isVisited ? <Check size={16} strokeWidth={2.5} /> : stopNumber}
        </div>

        {/* Store info */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-base leading-tight ${
              isVisited
                ? 'line-through text-teal/60'
                : darkMode ? 'text-cream-border' : 'text-ink-900'
            }`}>
              {store.name}
            </span>
            {store.new2026 && (
              <span className="bg-navy-light/10 text-navy-light text-xs px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                NEW
              </span>
            )}
            {store.thirdPlace && (
              <span className="bg-navy-darkest/10 text-navy text-xs px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                3P
              </span>
            )}
            {store.timeSensitive && (
              <span className="inline-flex items-center gap-0.5 bg-amber-tint text-amber border border-amber-border text-xs px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                <Clock size={9} strokeWidth={2} />
                closes early
              </span>
            )}
            {stop.lastStop && (
              <span className="bg-gold-tint text-amber text-xs px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                last stop
              </span>
            )}
          </div>

          <div className={`text-xs mt-0.5 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
            {store.address}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs">
            <span className={darkMode ? 'text-cream-border' : 'text-ink-700'}>
              Arrive <strong>{stop.time}</strong>
            </span>
            <span className={darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}>
              {hours}
            </span>
          </div>

          {stop.travelTime && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
              {stop.directionMode === 'walking'
                ? <Footprints size={12} strokeWidth={2} />
                : <Navigation size={12} strokeWidth={2} />}
              <span>{stop.travelTime} from {stop.travelFrom}</span>
            </div>
          )}

          {store.notes && (
            <div className={`mt-1.5 text-xs px-2 py-1 rounded-lg flex items-start gap-1 ${
              store.timeSensitive
                ? darkMode ? 'bg-amber/10 text-amber' : 'bg-amber-tint text-amber-dark border border-amber-border/50'
                : darkMode ? 'bg-navy-raised text-[#A8906A]' : 'bg-cream-page text-ink-700'
            }`}>
              <Info size={11} strokeWidth={2} className="flex-shrink-0 mt-0.5" />
              <span>{store.notes}</span>
            </div>
          )}

          {isCurrent && !isVisited && (
            <div className="mt-1.5 inline-flex items-center gap-1 bg-amber text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              <MapPin size={10} strokeWidth={2} />
              current stop
            </div>
          )}
        </div>

        {/* Store thumbnail */}
        <StoreThumbnail
          storeId={stop.storeId}
          name={store.name}
          isVisited={isVisited}
          isCurrent={isCurrent}
          darkMode={darkMode}
        />
      </div>

      {/* Notes section */}
      {showNotes && (
        <div className="mt-3">
          <textarea
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Add a note about this store..."
            className={`w-full text-sm p-2 rounded-lg border resize-none h-16 focus:outline-none focus:ring-2 focus:ring-navy-light ${
              darkMode
                ? 'bg-navy-raised border-navy-border text-cream-border placeholder-[#6A7A8A]'
                : 'bg-cream-page border-cream-border text-ink-900 placeholder-ink-300'
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
                ? 'border-navy-border text-[#A8906A] hover:bg-navy-raised'
                : 'border-cream-border text-ink-500 hover:bg-cream-page'
            }`}
          >
            Website
          </a>
        )}

        {/* Directions */}
        {stop.directionUrl && (
          <a
            href={stop.directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-navy-light hover:bg-navy-hover transition-colors flex items-center gap-1"
          >
            {stop.directionMode === 'walking'
              ? <><Footprints size={12} strokeWidth={2} /> Walk</>
              : <><Navigation size={12} strokeWidth={2} /> Drive</>}
          </a>
        )}

        {/* Notes toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
            note
              ? darkMode ? 'border-amber-border text-amber bg-amber/10' : 'border-amber-border text-amber-dark bg-amber-tint'
              : darkMode ? 'border-navy-border text-[#6A7A8A] hover:bg-navy-raised' : 'border-cream-border text-ink-500 hover:bg-cream-page'
          }`}
        >
          <Pencil size={12} strokeWidth={2} />
          {note ? 'Note' : 'Notes'}
        </button>

        {/* Skip/unskip */}
        {!isVisited && (
          isSkipped ? (
            <button
              onClick={() => onUnskip(stop.storeId)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                darkMode ? 'border-navy-border text-[#A8906A] hover:bg-navy-raised' : 'border-cream-border text-ink-500 hover:bg-cream-page'
              }`}
            >
              <Undo2 size={12} strokeWidth={2} />
              Unskip
            </button>
          ) : (
            <button
              onClick={() => onSkip(stop.storeId)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                darkMode ? 'border-amber-border/50 text-amber hover:bg-amber/10' : 'border-amber-border text-amber-dark hover:bg-amber-tint'
              }`}
            >
              <SkipForward size={12} strokeWidth={2} />
              Skip
            </button>
          )
        )}

        {/* Mark visited / unmark */}
        <div className="flex-1 flex justify-end">
          {isVisited ? (
            <button
              onClick={() => onUnmarkVisited(stop.storeId)}
              className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors flex items-center gap-1 ${
                darkMode
                  ? 'border-teal-border text-teal bg-teal/10 hover:bg-teal/20'
                  : 'border-teal-border text-teal bg-teal-tint hover:bg-teal/10'
              }`}
            >
              <Check size={14} strokeWidth={2.5} />
              Visited
            </button>
          ) : (
            <button
              onClick={() => onMarkVisited(stop.storeId)}
              disabled={isSkipped}
              className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors active:scale-[0.97] ${
                isSkipped
                  ? 'bg-ink-300 cursor-not-allowed'
                  : 'bg-navy-light hover:bg-navy-hover'
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

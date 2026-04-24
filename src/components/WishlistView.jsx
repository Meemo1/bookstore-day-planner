import { useState } from 'react';

function WishlistItem({ item, onToggle, onRemove, darkMode, isLast }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${
      !isLast ? (darkMode ? 'border-b border-gray-700' : 'border-b border-cream-200') : ''
    }`}>
      <button
        onClick={() => onToggle(item.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          item.gotIt
            ? 'bg-forest border-forest'
            : darkMode ? 'border-gray-500 hover:border-forest' : 'border-gray-300 hover:border-forest'
        }`}
        aria-label={item.gotIt ? 'Mark not found' : 'Mark found'}
      >
        {item.gotIt && <span className="text-white text-xs leading-none">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm ${
          item.gotIt
            ? darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
            : darkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {item.title}
        </div>
        {item.author && (
          <div className={`text-xs mt-0.5 ${
            item.gotIt
              ? darkMode ? 'text-gray-600' : 'text-gray-400'
              : darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {item.author}
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className={`flex-shrink-0 text-xs px-1 py-1 transition-colors ${
          darkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500'
        }`}
        aria-label="Remove"
      >
        ✕
      </button>
    </div>
  );
}

export default function WishlistView({ wishlists, onAdd, onToggle, onRemove, darkMode }) {
  const [activePerson, setActivePerson] = useState('emily');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(activePerson, title.trim(), author.trim());
    setTitle('');
    setAuthor('');
  };

  const items = wishlists[activePerson] || [];
  const pending = items.filter(i => !i.gotIt);
  const found = items.filter(i => i.gotIt);

  const inputClass = `w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500'
      : 'bg-cream-50 border-gray-200 text-gray-800 placeholder-gray-400'
  }`;

  return (
    <div className="space-y-4">
      {/* Person tabs */}
      <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        {[
          { key: 'emily', label: "Emily's List" },
          { key: 'iris', label: "Iris's List" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActivePerson(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activePerson === key
                ? 'bg-forest text-white shadow'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Add form */}
      <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm space-y-2`}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Book title"
          className={inputClass}
        />
        <div className="flex gap-2">
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Author (optional)"
            className={`${inputClass} flex-1`}
          />
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-forest hover:bg-forest-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Empty state */}
      {pending.length === 0 && found.length === 0 && (
        <div className={`text-center py-10 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'} italic`}>
          No books on this list yet.
        </div>
      )}

      {/* Pending items */}
      {pending.length > 0 && (
        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {pending.map((item, idx) => (
            <WishlistItem
              key={item.id}
              item={item}
              onToggle={(id) => onToggle(activePerson, id)}
              onRemove={(id) => onRemove(activePerson, id)}
              darkMode={darkMode}
              isLast={idx === pending.length - 1}
            />
          ))}
        </div>
      )}

      {/* Found items */}
      {found.length > 0 && (
        <div>
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 px-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Found ({found.length})
          </div>
          <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm opacity-70`}>
            {found.map((item, idx) => (
              <WishlistItem
                key={item.id}
                item={item}
                onToggle={(id) => onToggle(activePerson, id)}
                onRemove={(id) => onRemove(activePerson, id)}
                darkMode={darkMode}
                isLast={idx === found.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

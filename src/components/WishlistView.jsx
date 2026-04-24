import { useState } from 'react';
import { Check, X } from 'lucide-react';

function WishlistItem({ item, onToggle, onRemove, darkMode, isLast }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${
      !isLast ? (darkMode ? 'border-b border-navy-border' : 'border-b border-cream-border') : ''
    }`}>
      <button
        onClick={() => onToggle(item.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          item.gotIt
            ? 'bg-teal border-teal'
            : darkMode ? 'border-navy-border hover:border-teal' : 'border-cream-border hover:border-teal'
        }`}
        aria-label={item.gotIt ? 'Mark not found' : 'Mark found'}
      >
        {item.gotIt && <Check size={11} strokeWidth={3} className="text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm ${
          item.gotIt
            ? 'line-through text-ink-300'
            : darkMode ? 'text-cream-border' : 'text-ink-900'
        }`}>
          {item.title}
        </div>
        {item.author && (
          <div className={`text-xs mt-0.5 ${
            item.gotIt
              ? darkMode ? 'text-[#6A7A8A]' : 'text-ink-100'
              : darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'
          }`}>
            {item.author}
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className={`flex-shrink-0 p-1 transition-colors ${
          darkMode ? 'text-[#6A7A8A] hover:text-[#A8906A]' : 'text-ink-100 hover:text-ink-300'
        }`}
        aria-label="Remove"
      >
        <X size={13} strokeWidth={2} />
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

  const inputClass = `w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-navy-light ${
    darkMode
      ? 'bg-navy-raised border-navy-border text-cream-border placeholder-[#6A7A8A]'
      : 'bg-cream-page border-cream-border text-ink-900 placeholder-ink-300'
  }`;

  return (
    <div className="space-y-4">
      {/* Person tabs */}
      <div className={`flex rounded-xl p-1 shadow-sm ${darkMode ? 'bg-navy-deep' : 'bg-cream-white'}`}>
        {[
          { key: 'emily', label: "Emily's List" },
          { key: 'iris', label: "Iris's List" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActivePerson(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activePerson === key
                ? 'bg-navy-light text-white shadow'
                : darkMode ? 'text-[#6A7A8A] hover:text-cream-border' : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Add form */}
      <div className={`rounded-xl p-4 shadow-sm space-y-2 ${darkMode ? 'bg-navy-deep' : 'bg-cream-white'}`}>
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
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-navy-light hover:bg-navy-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-[0.97]"
          >
            Add
          </button>
        </div>
      </div>

      {/* Empty state */}
      {pending.length === 0 && found.length === 0 && (
        <div className={`text-center py-10 text-sm italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
          No books on this list yet.
        </div>
      )}

      {/* Pending items */}
      {pending.length > 0 && (
        <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-navy-deep' : 'bg-cream-white'}`}>
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
            darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'
          }`}>
            Found ({found.length})
          </div>
          <div className={`rounded-xl overflow-hidden shadow-sm opacity-70 ${darkMode ? 'bg-navy-deep' : 'bg-cream-white'}`}>
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

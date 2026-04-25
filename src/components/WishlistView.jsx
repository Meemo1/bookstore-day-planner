import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

const AMAZON_ASIN_RE = /\/dp\/([A-Z0-9]{10})/;

const GENRES = [
  'Cookbooks',
  'Fantasy',
  'Literary Fiction/Contemporary',
  'Mystery',
  'Non-fiction',
  'Romance',
  'Science Fiction',
  'Suspense',
];

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
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt=""
          className="flex-shrink-0 h-20 w-14 object-cover rounded"
        />
      )}
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
  const [genre, setGenre] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [kindleWarning, setKindleWarning] = useState(false);

  const handleTitleChange = async (e) => {
    const val = e.target.value;
    setKindleWarning(false);

    const asin = val.match(AMAZON_ASIN_RE)?.[1];
    if (!asin) {
      setTitle(val);
      return;
    }

    if (asin.startsWith('B')) {
      setTitle('');
      setKindleWarning(true);
      return;
    }

    const slugTitle = val.match(/amazon\.[^/]+\/([^/]+)\/dp\//)?.[1]
      ?.replace(/-+/g, ' ').trim() || '';

    setTitle('');
    setLoading(true);
    try {
      let found = false;

      if (!found) {
        try {
          const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
          const keyParam = apiKey ? `&key=${apiKey}` : '';
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${asin}&maxResults=1${keyParam}`);
          if (res.ok) {
            const data = await res.json();
            const book = data.items?.[0]?.volumeInfo;
            if (book) {
              setTitle(book.title || '');
              setAuthor(book.authors?.[0] || '');
              setThumbnail((book.imageLinks?.thumbnail || '').replace('http://', 'https://'));
              found = true;
            }
          }
        } catch { /* fall through */ }
      }

      if (!found) {
        try {
          const res = await fetch(`https://openlibrary.org/search.json?isbn=${asin}&limit=1`);
          const data = await res.json();
          const doc = data.docs?.[0];
          if (doc) {
            setTitle(doc.title || '');
            setAuthor(doc.author_name?.[0] || '');
            const coverUrl = doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : `https://covers.openlibrary.org/b/isbn/${asin}-M.jpg`;
            setThumbnail(coverUrl);
            found = true;
          }
        } catch { /* fall through */ }
      }

      if (!found) {
        setTitle(slugTitle || val);
      }
    } catch {
      setTitle(slugTitle || val);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(activePerson, title.trim(), author.trim(), thumbnail || undefined, genre || undefined);
    setTitle('');
    setAuthor('');
    setGenre('');
    setThumbnail('');
    setKindleWarning(false);
  };

  const allItems = wishlists[activePerson] || [];

  const groupByGenre = (items) => {
    const byGenre = {};
    const untagged = [];
    items.forEach(item => {
      if (item.genre) {
        if (!byGenre[item.genre]) byGenre[item.genre] = [];
        byGenre[item.genre].push(item);
      } else {
        untagged.push(item);
      }
    });
    const sorted = (arr) => [...arr].sort((a, b) => a.title.localeCompare(b.title));
    const groups = GENRES
      .filter(g => byGenre[g]?.length)
      .map(g => ({ genre: g, items: sorted(byGenre[g]) }));
    if (untagged.length) groups.push({ genre: null, items: sorted(untagged) });
    return groups;
  };

  const pendingGroups = groupByGenre(allItems.filter(i => !i.gotIt));
  const found = [...allItems.filter(i => i.gotIt)].sort((a, b) => a.title.localeCompare(b.title));

  const inputClass = `w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-navy-light ${
    darkMode
      ? 'bg-navy-raised border-navy-border text-cream-border placeholder-[#6A7A8A]'
      : 'bg-cream-page border-cream-border text-ink-900 placeholder-ink-300'
  }`;

  const selectClass = `flex-1 text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-navy-light ${
    darkMode
      ? 'bg-navy-raised border-navy-border text-cream-border'
      : 'bg-cream-page border-cream-border text-ink-900'
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
        <div className="relative">
          <input
            value={title}
            onChange={handleTitleChange}
            onKeyDown={e => e.key === 'Enter' && !loading && handleAdd()}
            placeholder="Book title or Amazon URL"
            className={inputClass}
          />
          {loading && (
            <Loader2
              size={15}
              className={`absolute right-3 top-1/2 -translate-y-1/2 animate-spin ${
                darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'
              }`}
            />
          )}
        </div>
        {kindleWarning && (
          <p className={`text-xs px-1 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
            Kindle ASINs can't be looked up — type the title manually.
          </p>
        )}
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleAdd()}
          placeholder="Author (optional)"
          className={inputClass}
        />
        <div className="flex gap-2">
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className={selectClass}
          >
            <option value="">Genre (optional)</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <button
            onClick={handleAdd}
            disabled={!title.trim() || loading}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-navy-light hover:bg-navy-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-[0.97]"
          >
            Add
          </button>
        </div>
      </div>

      {/* Empty state */}
      {pendingGroups.length === 0 && found.length === 0 && (
        <div className={`text-center py-10 text-sm italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
          No books on this list yet.
        </div>
      )}

      {/* Pending items grouped by genre */}
      {pendingGroups.map(({ genre, items }) => (
        <div key={genre ?? '__untagged__'}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 px-1 ${
            darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'
          }`}>
            {genre ?? 'Other'}
          </div>
          <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-navy-deep' : 'bg-cream-white'}`}>
            {items.map((item, idx) => (
              <WishlistItem
                key={item.id}
                item={item}
                onToggle={(id) => onToggle(activePerson, id)}
                onRemove={(id) => onRemove(activePerson, id)}
                darkMode={darkMode}
                isLast={idx === items.length - 1}
              />
            ))}
          </div>
        </div>
      ))}

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

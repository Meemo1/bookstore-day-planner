import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

const AMAZON_ASIN_RE = /\/dp\/([A-Z0-9]{10})/;

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

    // Extract title from the URL slug as a last-resort fallback
    const slugTitle = val.match(/amazon\.[^/]+\/([^/]+)\/dp\//)?.[1]
      ?.replace(/-+/g, ' ').trim() || '';

    setTitle('');
    setLoading(true);
    try {
      let found = false;

      // 1. Try Google Books
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

      // 2. Try Open Library search
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

      // 3. Fall back to title extracted from URL slug
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
    onAdd(activePerson, title.trim(), author.trim(), thumbnail || undefined);
    setTitle('');
    setAuthor('');
    setThumbnail('');
    setKindleWarning(false);
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
        <div className="flex gap-2">
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleAdd()}
            placeholder="Author (optional)"
            className={`${inputClass} flex-1`}
          />
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

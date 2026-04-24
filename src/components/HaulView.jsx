import { useState } from 'react';
import { Lock, Unlock, X } from 'lucide-react';
import { saturdayRoute, sundayRoute } from '../data/routes';
import { getStoreById } from '../data/stores';

const PIN_KEY = 'ibd2026_cost_pin';

function PinModal({ mode, onConfirm, onCancel, darkMode }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const inputClass = `w-full text-center text-xl tracking-[0.4em] px-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-navy-light ${
    darkMode
      ? 'bg-navy-raised border-navy-border text-cream-border placeholder-[#6A7A8A]'
      : 'bg-cream-page border-cream-border text-ink-900'
  }`;

  const handleSubmit = () => {
    if (mode === 'set') {
      if (pin.length < 4) { setError('PIN must be at least 4 characters'); return; }
      if (pin !== confirmPin) { setError("PINs don't match"); return; }
      localStorage.setItem(PIN_KEY, pin);
      onConfirm();
    } else {
      if (pin === localStorage.getItem(PIN_KEY)) {
        onConfirm();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className={`rounded-2xl p-6 max-w-xs w-full shadow-2xl ${
        darkMode ? 'bg-navy-deep text-cream-border' : 'bg-white text-ink-900'
      }`}>
        <h2 className="text-lg font-bold text-center mb-1">
          {mode === 'set' ? 'Set a cost PIN' : 'Enter PIN'}
        </h2>
        <p className={`text-xs text-center mb-5 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-500'}`}>
          {mode === 'set'
            ? 'Hides purchase totals from casual viewing'
            : 'Costs are hidden until unlocked'}
        </p>
        <div className="space-y-2">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && (mode === 'enter' ? handleSubmit() : null)}
            placeholder="••••"
            autoFocus
            className={inputClass}
          />
          {mode === 'set' && (
            <input
              type="password"
              inputMode="numeric"
              value={confirmPin}
              onChange={e => { setConfirmPin(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Confirm PIN"
              className={inputClass}
            />
          )}
        </div>
        {error && (
          <p className="text-amber-dark text-xs text-center mt-2">{error}</p>
        )}
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
              darkMode ? 'border-navy-border text-[#A8906A] hover:bg-navy-raised' : 'border-cream-border text-ink-500 hover:bg-cream-page'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-light hover:bg-navy-hover transition-colors"
          >
            {mode === 'set' ? 'Set PIN' : 'Unlock'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StoreHaulSection({ store, items, costsVisible, onAdd, onRemove, darkMode }) {
  const [adding, setAdding] = useState(false);
  const [itemText, setItemText] = useState('');
  const [costText, setCostText] = useState('');

  const handleAdd = () => {
    if (!itemText.trim()) return;
    onAdd(store.id, itemText.trim(), parseFloat(costText) || 0);
    setItemText('');
    setCostText('');
    setAdding(false);
  };

  const storeTotal = items.reduce((sum, p) => sum + p.cost, 0);

  const inputClass = (extra = '') => `text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-navy-light ${
    darkMode
      ? 'bg-navy-raised border-navy-border text-cream-border placeholder-[#6A7A8A]'
      : 'bg-cream-white border-cream-border text-ink-900 placeholder-ink-300'
  } ${extra}`;

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-navy-deep' : 'bg-cream-white'}`}>
      {/* Store header */}
      <div className={`flex items-center justify-between px-4 py-3 ${
        (items.length > 0 || adding) ? (darkMode ? 'border-b border-navy-border' : 'border-b border-cream-border') : ''
      }`}>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${darkMode ? 'text-cream-border' : 'text-ink-900'}`}>
            {store.name}
          </div>
          {items.length > 0 && (
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
              {items.length} item{items.length !== 1 ? 's' : ''}
              {costsVisible ? ` · $${storeTotal.toFixed(2)}` : ''}
            </div>
          )}
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
            darkMode
              ? 'bg-navy-light/10 text-navy-light hover:bg-navy-light/20'
              : 'bg-navy-light/10 text-navy-light hover:bg-navy-light/20'
          }`}
        >
          + Add
        </button>
      </div>

      {/* Inline add form */}
      {adding && (
        <div className={`px-4 py-3 space-y-2 ${darkMode ? 'bg-navy-raised/40 border-b border-navy-border' : 'bg-cream-page border-b border-cream-border'}`}>
          <input
            value={itemText}
            onChange={e => setItemText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="What did you buy?"
            autoFocus
            className={inputClass('w-full')}
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>$</span>
              <input
                type="number"
                inputMode="decimal"
                value={costText}
                onChange={e => setCostText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="0.00"
                className={inputClass('w-full pl-6')}
              />
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-navy-light hover:bg-navy-hover transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => { setAdding(false); setItemText(''); setCostText(''); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'text-[#6A7A8A] hover:text-cream-border' : 'text-ink-300 hover:text-ink-700'}`}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* Purchase rows */}
      {items.map((purchase, idx) => (
        <div
          key={purchase.id}
          className={`flex items-center gap-3 px-4 py-3 ${
            idx < items.length - 1 ? (darkMode ? 'border-b border-navy-border/50' : 'border-b border-cream-border/50') : ''
          }`}
        >
          <div className={`flex-1 text-sm ${darkMode ? 'text-cream-border' : 'text-ink-700'}`}>
            {purchase.item}
          </div>
          <div className={`text-sm font-semibold min-w-[56px] text-right ${
            costsVisible
              ? darkMode ? 'text-cream-border' : 'text-ink-700'
              : darkMode ? 'text-[#6A7A8A]' : 'text-ink-100'
          }`}>
            {costsVisible ? `$${purchase.cost.toFixed(2)}` : '—'}
          </div>
          <button
            onClick={() => onRemove(store.id, purchase.id)}
            className={`text-xs pl-2 transition-colors ${
              darkMode ? 'text-[#6A7A8A] hover:text-[#A8906A]' : 'text-ink-100 hover:text-ink-300'
            }`}
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}

// Route order for visited stores
const routeStoreIds = [
  ...saturdayRoute.filter(s => s.type === 'store').map(s => s.storeId),
  ...sundayRoute.filter(s => s.type === 'store').map(s => s.storeId),
];

export default function HaulView({ purchases, visitedStores, onAdd, onRemove, darkMode }) {
  const [costsVisible, setCostsVisible] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinMode, setPinMode] = useState('enter');

  const relevantStoreIds = routeStoreIds.filter(id =>
    visitedStores.includes(id) || (purchases[id]?.length > 0)
  );

  const allItems = Object.values(purchases).flat();
  const grandTotal = allItems.reduce((sum, p) => sum + p.cost, 0);

  const handleShowCosts = () => {
    const hasPin = !!localStorage.getItem(PIN_KEY);
    setPinMode(hasPin ? 'enter' : 'set');
    setShowPinModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 shadow-sm ${
        darkMode ? 'bg-navy-deep' : 'bg-cream-white'
      }`}>
        <div>
          <div className={`text-sm font-semibold ${darkMode ? 'text-cream-border' : 'text-ink-900'}`}>
            {allItems.length} item{allItems.length !== 1 ? 's' : ''} purchased
          </div>
          <div className={`text-xs mt-0.5 ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
            Total:{' '}
            {costsVisible
              ? <span className="text-teal">${grandTotal.toFixed(2)}</span>
              : <span className={darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}>hidden</span>}
          </div>
        </div>
        <button
          onClick={costsVisible ? () => setCostsVisible(false) : handleShowCosts}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            costsVisible
              ? darkMode ? 'bg-amber/20 text-amber hover:bg-amber/30' : 'bg-amber-tint text-amber-dark hover:bg-amber-border/30'
              : darkMode ? 'bg-navy-light/10 text-navy-light hover:bg-navy-light/20' : 'bg-navy-light/10 text-navy-light hover:bg-navy-light/20'
          }`}
        >
          {costsVisible
            ? <><Unlock size={12} strokeWidth={2} /> Hide costs</>
            : <><Lock size={12} strokeWidth={2} /> Show costs</>}
        </button>
      </div>

      {/* Store sections */}
      {relevantStoreIds.length === 0 ? (
        <div className={`text-center py-10 text-sm italic ${darkMode ? 'text-[#6A7A8A]' : 'text-ink-300'}`}>
          Mark a store as visited, then come back here to log your purchases.
        </div>
      ) : (
        relevantStoreIds.map(storeId => {
          const store = getStoreById(storeId);
          if (!store) return null;
          return (
            <StoreHaulSection
              key={storeId}
              store={store}
              items={purchases[storeId] || []}
              costsVisible={costsVisible}
              onAdd={onAdd}
              onRemove={onRemove}
              darkMode={darkMode}
            />
          );
        })
      )}

      {showPinModal && (
        <PinModal
          mode={pinMode}
          onConfirm={() => { setCostsVisible(true); setShowPinModal(false); }}
          onCancel={() => setShowPinModal(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

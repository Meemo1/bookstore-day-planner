import { useState } from 'react';
import { saturdayRoute, sundayRoute } from '../data/routes';
import { getStoreById } from '../data/stores';

const PIN_KEY = 'ibd2026_cost_pin';

function PinModal({ mode, onConfirm, onCancel, darkMode }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const inputClass = `w-full text-center text-xl tracking-[0.4em] px-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-cream-50 border-gray-200 text-gray-800'
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
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-lg font-bold text-center mb-1">
          {mode === 'set' ? 'Set a cost PIN' : 'Enter PIN'}
        </h2>
        <p className={`text-xs text-center mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
          <p className="text-burgundy text-xs text-center mt-2">{error}</p>
        )}
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-forest hover:bg-forest-light transition-colors"
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

  const inputClass = (extra = '') => `text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
  } ${extra}`;

  return (
    <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      {/* Store header */}
      <div className={`flex items-center justify-between px-4 py-3 ${
        (items.length > 0 || adding) ? (darkMode ? 'border-b border-gray-700' : 'border-b border-cream-200') : ''
      }`}>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {store.name}
          </div>
          {items.length > 0 && (
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {items.length} item{items.length !== 1 ? 's' : ''}
              {costsVisible ? ` · $${storeTotal.toFixed(2)}` : ''}
            </div>
          )}
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
            darkMode ? 'bg-forest/20 text-green-300 hover:bg-forest/30' : 'bg-forest/10 text-forest hover:bg-forest/20'
          }`}
        >
          + Add
        </button>
      </div>

      {/* Inline add form */}
      {adding && (
        <div className={`px-4 py-3 space-y-2 ${darkMode ? 'bg-gray-700/40 border-b border-gray-700' : 'bg-cream-50 border-b border-cream-200'}`}>
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
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>$</span>
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
              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-forest hover:bg-forest-light transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => { setAdding(false); setItemText(''); setCostText(''); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Purchase rows */}
      {items.map((purchase, idx) => (
        <div
          key={purchase.id}
          className={`flex items-center gap-3 px-4 py-3 ${
            idx < items.length - 1 ? (darkMode ? 'border-b border-gray-700/50' : 'border-b border-cream-100') : ''
          }`}
        >
          <div className={`flex-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {purchase.item}
          </div>
          <div className={`text-sm font-semibold min-w-[56px] text-right ${
            costsVisible
              ? darkMode ? 'text-gray-300' : 'text-gray-700'
              : darkMode ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {costsVisible ? `$${purchase.cost.toFixed(2)}` : '—'}
          </div>
          <button
            onClick={() => onRemove(store.id, purchase.id)}
            className={`text-xs pl-2 transition-colors ${
              darkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500'
            }`}
          >
            ✕
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

  // Stores to show: visited OR already has purchases, in route order
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
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}>
        <div>
          <div className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {allItems.length} item{allItems.length !== 1 ? 's' : ''} purchased
          </div>
          <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Total:{' '}
            {costsVisible
              ? <span className={darkMode ? 'text-green-400' : 'text-forest'}>${grandTotal.toFixed(2)}</span>
              : <span>🔒 hidden</span>}
          </div>
        </div>
        <button
          onClick={costsVisible ? () => setCostsVisible(false) : handleShowCosts}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
            costsVisible
              ? darkMode ? 'bg-burgundy/20 text-red-300 hover:bg-burgundy/30' : 'bg-burgundy/10 text-burgundy hover:bg-burgundy/20'
              : darkMode ? 'bg-forest/20 text-green-300 hover:bg-forest/30' : 'bg-forest/10 text-forest hover:bg-forest/20'
          }`}
        >
          {costsVisible ? '🔓 Hide costs' : '🔒 Show costs'}
        </button>
      </div>

      {/* Store sections */}
      {relevantStoreIds.length === 0 ? (
        <div className={`text-center py-10 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'} italic`}>
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

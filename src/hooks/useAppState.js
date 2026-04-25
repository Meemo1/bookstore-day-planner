import { useState, useEffect, useCallback, useRef } from 'react';
import { saturdayStoreIds, sundayStoreIds } from '../data/routes';

const STORAGE_KEY = 'ibd2026_planner';
const SYNC_FIELDS = ['visitedStores', 'skippedStores', 'notes', 'wishlists', 'purchases'];

const defaultState = {
  visitedStores: [],
  skippedStores: [],
  notes: {},
  activeDay: 'saturday',
  activeView: 'itinerary',
  activeSection: 'route',
  darkMode: false,
  wishlists: { emily: [], iris: [] },
  purchases: {},
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function extractSyncPayload(state, syncedAt) {
  const payload = { _syncedAt: syncedAt };
  SYNC_FIELDS.forEach(f => { payload[f] = state[f]; });
  return payload;
}

export function useAppState() {
  const [state, setState] = useState(loadState);
  const syncTimerRef = useRef(null);
  const lastWriteAtRef = useRef(0);
  const latestStateRef = useRef(state);

  // Keep ref in sync for use inside debounce timer
  useEffect(() => {
    latestStateRef.current = state;
  });

  // Persist to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // On mount: pull remote state and merge it in
  useEffect(() => {
    fetch('/api/state')
      .then(r => r.ok ? r.json() : null)
      .then(remote => {
        if (!remote?._syncedAt) return;
        lastWriteAtRef.current = new Date(remote._syncedAt).getTime();
        setState(prev => ({
          ...prev,
          ...Object.fromEntries(SYNC_FIELDS.map(f => [f, remote[f] ?? prev[f]])),
        }));
      })
      .catch(() => {});
  }, []);

  // Debounced write to API on any sync-field change
  useEffect(() => {
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      const now = Date.now();
      const payload = extractSyncPayload(latestStateRef.current, new Date(now).toISOString());
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(() => { lastWriteAtRef.current = now; })
        .catch(() => {});
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.visitedStores, state.skippedStores, state.notes, state.wishlists, state.purchases]);

  // Poll every 15s — update local if remote is newer than our last write
  useEffect(() => {
    const poll = setInterval(() => {
      fetch('/api/state')
        .then(r => r.ok ? r.json() : null)
        .then(remote => {
          if (!remote?._syncedAt) return;
          const remoteAt = new Date(remote._syncedAt).getTime();
          if (remoteAt > lastWriteAtRef.current) {
            lastWriteAtRef.current = remoteAt;
            setState(prev => ({
              ...prev,
              ...Object.fromEntries(SYNC_FIELDS.map(f => [f, remote[f] ?? prev[f]])),
            }));
          }
        })
        .catch(() => {});
    }, 15000);
    return () => clearInterval(poll);
  }, []);

  const markVisited = useCallback((storeId) => {
    setState(prev => {
      if (prev.visitedStores.includes(storeId)) return prev;
      return {
        ...prev,
        visitedStores: [...prev.visitedStores, storeId],
        skippedStores: prev.skippedStores.filter(id => id !== storeId),
      };
    });
  }, []);

  const unmarkVisited = useCallback((storeId) => {
    setState(prev => ({
      ...prev,
      visitedStores: prev.visitedStores.filter(id => id !== storeId),
    }));
  }, []);

  const skipStore = useCallback((storeId) => {
    setState(prev => ({
      ...prev,
      skippedStores: prev.skippedStores.includes(storeId)
        ? prev.skippedStores
        : [...prev.skippedStores, storeId],
      visitedStores: prev.visitedStores.filter(id => id !== storeId),
    }));
  }, []);

  const unskipStore = useCallback((storeId) => {
    setState(prev => ({
      ...prev,
      skippedStores: prev.skippedStores.filter(id => id !== storeId),
    }));
  }, []);

  const setNote = useCallback((storeId, note) => {
    setState(prev => ({
      ...prev,
      notes: { ...prev.notes, [storeId]: note },
    }));
  }, []);

  const setActiveDay = useCallback((day) => {
    setState(prev => ({ ...prev, activeDay: day }));
  }, []);

  const setActiveView = useCallback((view) => {
    setState(prev => ({ ...prev, activeView: view }));
  }, []);

  const setActiveSection = useCallback((section) => {
    setState(prev => ({ ...prev, activeSection: section }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const resetAll = useCallback(() => {
    setState(defaultState);
  }, []);

  const importProgress = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      setState(prev => ({
        ...prev,
        visitedStores: Array.isArray(data.visitedStores) ? data.visitedStores : prev.visitedStores,
        skippedStores: Array.isArray(data.skippedStores) ? data.skippedStores : prev.skippedStores,
        notes: (data.notes && typeof data.notes === 'object') ? data.notes : prev.notes,
        wishlists: (data.wishlists && typeof data.wishlists === 'object') ? data.wishlists : prev.wishlists,
        purchases: (data.purchases && typeof data.purchases === 'object') ? data.purchases : prev.purchases,
      }));
      return true;
    } catch {
      return false;
    }
  }, []);

  const exportProgress = useCallback(() => {
    const data = {
      exported: new Date().toISOString(),
      visitedStores: state.visitedStores,
      skippedStores: state.skippedStores,
      notes: state.notes,
      wishlists: state.wishlists,
      purchases: state.purchases,
      totalVisited: state.visitedStores.length,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ibd2026-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const addWishlistItem = useCallback((person, title, author, thumbnail, genre) => {
    setState(prev => ({
      ...prev,
      wishlists: {
        ...prev.wishlists,
        [person]: [...(prev.wishlists[person] || []), {
          id: makeId(), title, author, gotIt: false,
          ...(thumbnail ? { thumbnail } : {}),
          ...(genre ? { genre } : {}),
        }],
      },
    }));
  }, []);

  const toggleWishlistItem = useCallback((person, id) => {
    setState(prev => ({
      ...prev,
      wishlists: {
        ...prev.wishlists,
        [person]: prev.wishlists[person].map(item =>
          item.id === id ? { ...item, gotIt: !item.gotIt } : item
        ),
      },
    }));
  }, []);

  const removeWishlistItem = useCallback((person, id) => {
    setState(prev => ({
      ...prev,
      wishlists: {
        ...prev.wishlists,
        [person]: prev.wishlists[person].filter(item => item.id !== id),
      },
    }));
  }, []);

  const addPurchase = useCallback((storeId, item, cost) => {
    setState(prev => ({
      ...prev,
      purchases: {
        ...prev.purchases,
        [storeId]: [...(prev.purchases[storeId] || []), { id: makeId(), item, cost }],
      },
    }));
  }, []);

  const removePurchase = useCallback((storeId, id) => {
    setState(prev => ({
      ...prev,
      purchases: {
        ...prev.purchases,
        [storeId]: (prev.purchases[storeId] || []).filter(p => p.id !== id),
      },
    }));
  }, []);

  const totalPlanned = 33;

  const getNextStore = useCallback((dayRoute) => {
    const storeStops = dayRoute.filter(s => s.type === 'store');
    return storeStops.find(
      stop => !state.visitedStores.includes(stop.storeId) && !state.skippedStores.includes(stop.storeId)
    ) || null;
  }, [state.visitedStores, state.skippedStores]);

  return {
    ...state,
    markVisited,
    unmarkVisited,
    skipStore,
    unskipStore,
    setNote,
    setActiveDay,
    setActiveView,
    setActiveSection,
    toggleDarkMode,
    resetAll,
    importProgress,
    exportProgress,
    addWishlistItem,
    toggleWishlistItem,
    removeWishlistItem,
    addPurchase,
    removePurchase,
    totalPlanned,
    getNextStore,
    saturdayStoreIds,
    sundayStoreIds,
  };
}

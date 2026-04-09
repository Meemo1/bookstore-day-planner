import { useState, useEffect, useCallback } from 'react';
import { saturdayStoreIds, sundayStoreIds } from '../data/routes';

const STORAGE_KEY = 'ibd2026_planner';

const defaultState = {
  visitedStores: [],
  skippedStores: [],
  notes: {},
  activeDay: 'saturday',
  activeView: 'itinerary',
  darkMode: false,
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

export function useAppState() {
  const [state, setState] = useState(loadState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Apply dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

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

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const resetAll = useCallback(() => {
    setState(defaultState);
  }, []);

  const exportProgress = useCallback(() => {
    const data = {
      exported: new Date().toISOString(),
      visitedStores: state.visitedStores,
      skippedStores: state.skippedStores,
      notes: state.notes,
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

  // Compute total planned stores (33: all except 2 Third Place dupes)
  const totalPlanned = 33;

  // Get next unvisited store for a given day's route
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
    toggleDarkMode,
    resetAll,
    exportProgress,
    totalPlanned,
    getNextStore,
    saturdayStoreIds,
    sundayStoreIds,
  };
}

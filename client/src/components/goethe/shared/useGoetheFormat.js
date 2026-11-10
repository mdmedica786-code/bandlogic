import { useEffect, useState, useCallback } from 'react';
import api from '../../../api/client';

// The exam format is static per level — fetch once per session.
const cache = new Map();
const pending = new Map();

// The last known format is also kept in localStorage, so a room opens at once
// even while the server is waking up; the fresh copy replaces it in the background.
const STORAGE_PREFIX = 'goethe:format:v1:';

function readStored(level) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + level);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function fetchFormat(level) {
  if (!pending.has(level)) {
    pending.set(
      level,
      api
        .get('/goethe/format', { params: { level } })
        .then((res) => {
          const data = res.data?.data;
          if (!data) throw new Error('Leeres Prüfungsformat');
          cache.set(level, data);
          try {
            localStorage.setItem(STORAGE_PREFIX + level, JSON.stringify(data));
          } catch {
            /* storage full or blocked — the in-memory cache is enough */
          }
          return data;
        })
        .finally(() => pending.delete(level))
    );
  }
  return pending.get(level);
}

const refreshed = new Set();

function loadFormat(level) {
  if (cache.has(level)) return Promise.resolve(cache.get(level));
  const stored = readStored(level);
  if (stored) {
    cache.set(level, stored);
    // Refresh once per session; a failure keeps the stored copy.
    if (!refreshed.has(level)) {
      refreshed.add(level);
      fetchFormat(level).catch(() => {});
    }
    return Promise.resolve(stored);
  }
  return fetchFormat(level);
}

/**
 * Official structure of the level (Teile, item types, numbering, times) from
 * GET /goethe/format — the single source of truth shared with the server.
 */
export function useGoetheFormat(level) {
  const [state, setState] = useState(() => ({ level, format: cache.get(level) || null, error: null }));
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => setRetryCount(c => c + 1), []);

  useEffect(() => {
    let alive = true;
    setState(s => ({ ...s, error: null }));
    loadFormat(level)
      .then((format) => alive && setState({ level, format, error: null }))
      .catch((err) => {
        if (!alive) return;
        let errMsg = 'Das Prüfungsformat konnte nicht geladen werden.';
        if (!err.response) {
          errMsg = 'Server nicht erreichbar oder Zugriff blockiert (CORS).';
        } else if (err.response.status) {
          errMsg = `Das Prüfungsformat konnte nicht geladen werden (Status ${err.response.status}).`;
        }
        setState({
          level,
          format: null,
          error: err.response?.data?.error || errMsg,
        });
      });
    return () => {
      alive = false;
    };
  }, [level, retryCount]);

  const current = state.level === level ? state : { level, format: cache.get(level) || null, error: null };
  return { format: current.format, error: current.error, loading: !current.format && !current.error, retry };
}

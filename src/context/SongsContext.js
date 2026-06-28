import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getLocalSongs, insertSong, syncFromSupabase } from '../data/songDatabase';
import { createSong } from '../data/songModel';
import { SONGS } from '../data/songs';
import { supabase } from '../lib/supabase';

const SongsContext = createContext();

const DEFAULT_GRADIENT = ['#6B3A1E', '#140B05'];
const BUNDLE_SONGS = (SONGS || []).filter(Boolean);

function bundleKey(song) {
  return `${song.title.trim().toLowerCase()}|||${song.artist.trim().toLowerCase()}`;
}

function normalizeSongInput(song) {
  return createSong({
    id: `custom-${Date.now()}`,
    title: song.title.trim(),
    artist: song.artist.trim(),
    key: song.key.trim(),
    difficulty: song.difficulty,
    category: song.category.trim(),
    gradient: DEFAULT_GRADIENT,
    lines: song.lines,
  });
}

export function SongsProvider({ children }) {
  const db = useSQLiteContext();
  const [localSongs, setLocalSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      // 1. Load SQLite songs (custom + previously synced from Supabase)
      try {
        const local = await getLocalSongs(db);
        if (active) setLocalSongs(local);
      } catch (err) {
        console.error('Failed to load local songs', err);
      } finally {
        if (active) setLoading(false);
      }

      // 2. Background Supabase sync — only adds songs not already in the bundle
      try {
        const { data, error } = await supabase.from('songs').select('*');
        if (error || !data || !active) return;

        const changed = await syncFromSupabase(db, data, BUNDLE_SONGS);
        if (changed && active) {
          const updated = await getLocalSongs(db);
          if (active) setLocalSongs(updated);
        }
      } catch {
        // No network — skip silently
      }
    }

    load();
    return () => { active = false; };
  }, [db]);

  // Merge: local SQLite songs first, then bundle songs (deduped by title+artist)
  const songs = useMemo(() => {
    const localKeys = new Set(localSongs.map(bundleKey));
    const bundleOnly = BUNDLE_SONGS.filter((s) => !localKeys.has(bundleKey(s)));
    return [...localSongs, ...bundleOnly];
  }, [localSongs]);

  const categories = useMemo(
    () => ['All', ...new Set(songs.map((s) => s.category).filter(Boolean))],
    [songs]
  );

  const sync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const { data, error } = await supabase.from('songs').select('*');
      if (error || !data) throw error ?? new Error('No data');

      const changed = await syncFromSupabase(db, data, BUNDLE_SONGS);
      if (changed) {
        const updated = await getLocalSongs(db);
        setLocalSongs(updated);
      }
    } finally {
      setSyncing(false);
    }
  };

  const addSong = async (song) => {
    const normalized = normalizeSongInput(song);

    // Write to SQLite first — works offline
    const saved = await insertSong(db, normalized);
    setLocalSongs((prev) => [saved, ...prev]);

    // Push to Supabase in background — best-effort
    supabase.from('songs').insert({
      title: normalized.title,
      artist: normalized.artist,
      key: normalized.key,
      difficulty: normalized.difficulty,
      category: normalized.category,
      gradient: normalized.gradient,
      lines: normalized.lines,
      chords: normalized.chords ?? [],
      is_custom: true,
    }).then(({ error }) => {
      if (error) console.warn('Supabase sync failed:', error.message);
    });

    return saved;
  };

  return (
    <SongsContext.Provider value={{ songs, categories, addSong, loading, sync, syncing }}>
      {children}
    </SongsContext.Provider>
  );
}

export const useSongs = () => useContext(SongsContext);

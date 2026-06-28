import React, { createContext, useContext, useMemo, useState } from 'react';
import { SONGS as SEEDED_SONGS, CATEGORIES as SEEDED_CATEGORIES, createSong } from '../data/songs';

const SongsContext = createContext();

const DEFAULT_GRADIENT = ['#6B3A1E', '#140B05'];

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
  const [customSongs, setCustomSongs] = useState([]);

  const songs = useMemo(() => [...customSongs, ...SEEDED_SONGS], [customSongs]);
  const categories = useMemo(
    () => ['All', ...new Set([...SEEDED_CATEGORIES.filter((item) => item !== 'All'), ...customSongs.map((song) => song.category)])],
    [customSongs]
  );

  const addSong = (song) => {
    const normalized = normalizeSongInput(song);
    setCustomSongs((prev) => [normalized, ...prev]);
    return normalized;
  };

  return (
    <SongsContext.Provider value={{ songs, categories, addSong }}>
      {children}
    </SongsContext.Provider>
  );
}

export const useSongs = () => useContext(SongsContext);

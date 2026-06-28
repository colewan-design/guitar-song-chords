export const line = (chord = '', lyric = '') => ({ chord, lyric });

export const breakLine = () => line();

export function extractChords(lines) {
  return [...new Set(lines.flatMap((entry) => {
    if (!entry.chord) return [];
    return entry.chord.trim().split(/\s+/).filter(Boolean);
  }))];
}

export function createSong(song) {
  return {
    ...song,
    lines: song.lines,
    sheet: song.lines.map(({ chord, lyric }) => [chord, lyric]),
    chords: extractChords(song.lines),
  };
}

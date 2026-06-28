import { createSong } from './songModel';

export const DATABASE_NAME = 'guitar-songs.db';

const DATABASE_VERSION = 3;
const DEFAULT_GRADIENT = ['#6B3A1E', '#140B05'];

function normalizeGradient(gradient) {
  if (Array.isArray(gradient) && gradient.length >= 2) {
    return [gradient[0], gradient[1]];
  }
  return DEFAULT_GRADIENT;
}

async function insertSongRecord(db, song, isCustom = 0) {
  const gradient = normalizeGradient(song.gradient);
  const createdAt = typeof song.createdAt === 'number' ? song.createdAt : Date.now();

  await db.runAsync(
    `INSERT OR IGNORE INTO songs (id, title, artist, song_key, difficulty, category, gradient_start, gradient_end, is_custom, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [song.id, song.title, song.artist, song.key, song.difficulty, song.category,
     gradient[0], gradient[1], isCustom, createdAt]
  );

  for (const [index, entry] of song.lines.entries()) {
    await db.runAsync(
      `INSERT OR IGNORE INTO song_lines (song_id, line_index, chord, lyric) VALUES (?, ?, ?, ?)`,
      [song.id, index, entry.chord ?? '', entry.lyric ?? '']
    );
  }
}

export async function migrateDbIfNeeded(db) {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');

  const versionRow = await db.getFirstAsync('PRAGMA user_version');
  const currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) return;

  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS songs (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        song_key TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        category TEXT NOT NULL,
        gradient_start TEXT NOT NULL,
        gradient_end TEXT NOT NULL,
        is_custom INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS song_lines (
        song_id TEXT NOT NULL,
        line_index INTEGER NOT NULL,
        chord TEXT NOT NULL DEFAULT '',
        lyric TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (song_id, line_index),
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
      );
    `);
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  });
}

export async function getLocalSongs(db) {
  const songs = await db.getAllAsync(
    `SELECT id, title, artist, song_key, difficulty, category, gradient_start, gradient_end, is_custom, created_at
     FROM songs ORDER BY created_at DESC`
  );

  const songLines = await db.getAllAsync(
    `SELECT song_id, line_index, chord, lyric FROM song_lines ORDER BY song_id, line_index`
  );

  const linesBySongId = songLines.reduce((map, row) => {
    if (!map.has(row.song_id)) map.set(row.song_id, []);
    map.get(row.song_id).push({ chord: row.chord, lyric: row.lyric });
    return map;
  }, new Map());

  return songs.map((song) => createSong({
    id: song.id,
    title: song.title,
    artist: song.artist,
    key: song.song_key,
    difficulty: song.difficulty,
    category: song.category,
    gradient: [song.gradient_start, song.gradient_end],
    lines: linesBySongId.get(song.id) ?? [],
    isCustom: Boolean(song.is_custom),
    createdAt: song.created_at,
  }));
}

export async function insertSong(db, song) {
  await db.withTransactionAsync(async () => {
    await insertSongRecord(db, song, 1);
  });

  return createSong({
    ...song,
    gradient: normalizeGradient(song.gradient),
  });
}

export async function syncFromSupabase(db, remoteSongs, bundleSongs) {
  const bundleKeys = new Set(
    bundleSongs.filter(Boolean).map((s) => `${s.title.trim().toLowerCase()}|||${s.artist.trim().toLowerCase()}`)
  );

  let changed = false;

  for (const remote of remoteSongs) {
    if (!remote.title || !remote.artist) continue;

    const key = `${remote.title.trim().toLowerCase()}|||${remote.artist.trim().toLowerCase()}`;
    if (bundleKeys.has(key)) continue;

    const existing = await db.getFirstAsync(
      'SELECT id, is_custom FROM songs WHERE LOWER(title) = LOWER(?) AND LOWER(artist) = LOWER(?)',
      [remote.title.trim(), remote.artist.trim()]
    );

    const gradient = normalizeGradient(remote.gradient);
    const lines = Array.isArray(remote.lines) ? remote.lines : [];
    const songId = existing ? existing.id : `remote-${remote.id}`;

    const song = createSong({
      id: songId,
      title: remote.title,
      artist: remote.artist,
      key: remote.key || 'C',
      difficulty: remote.difficulty || 'Intermediate',
      category: remote.category || 'Pop',
      gradient,
      lines,
      isCustom: false,
      createdAt: Date.now(),
    });

    if (!existing) {
      await db.withTransactionAsync(async () => {
        await insertSongRecord(db, song, 0);
      });
      changed = true;
    } else if (!existing.is_custom) {
      // Update non-custom remote song in case lyrics/chords/metadata changed
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE songs SET song_key = ?, difficulty = ?, category = ?, gradient_start = ?, gradient_end = ? WHERE id = ?`,
          [song.key, song.difficulty, song.category, gradient[0], gradient[1], existing.id]
        );
        await db.runAsync('DELETE FROM song_lines WHERE song_id = ?', [existing.id]);
        for (const [index, entry] of lines.entries()) {
          await db.runAsync(
            `INSERT INTO song_lines (song_id, line_index, chord, lyric) VALUES (?, ?, ?, ?)`,
            [existing.id, index, entry.chord ?? '', entry.lyric ?? '']
          );
        }
      });
      changed = true;
    }
    // Custom (user-created) songs are never overwritten by remote data
  }

  return changed;
}

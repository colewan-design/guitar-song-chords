import { parseSheet, extractChords, GRADIENTS, type SongLine } from '~/utils/parseSheet'

export interface Song {
  id: string
  title: string
  artist: string
  key: string
  difficulty: string
  category: string
  gradient: string[]
  lines: SongLine[]
  chords: string[]
  created_at: string
  updated_at: string
}

export interface SongInput {
  title: string
  artist: string
  key: string
  difficulty: string
  category: string
  sheetText: string
  gradient?: string[]
}

export function useSongs() {
  const supabase = useSupabaseClient()
  const songs = ref<Song[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSongs() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) { error.value = err.message } else { songs.value = data as Song[] }
    loading.value = false
  }

  async function addSong(input: SongInput): Promise<Song | null> {
    const lines = parseSheet(input.sheetText)
    const chords = extractChords(lines)
    const gradient = input.gradient ?? GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
    const { data, error: err } = await supabase.from('songs').insert({
      title: input.title.trim(),
      artist: input.artist.trim(),
      key: input.key.trim() || 'C',
      difficulty: input.difficulty,
      category: input.category.trim() || 'Custom',
      gradient,
      lines,
      chords,
    }).select().single()
    if (err) { error.value = err.message; return null }
    songs.value.unshift(data as Song)
    return data as Song
  }

  async function updateSong(id: string, input: Partial<SongInput>): Promise<boolean> {
    const patch: Record<string, unknown> = {
      title: input.title?.trim(),
      artist: input.artist?.trim(),
      key: input.key?.trim(),
      difficulty: input.difficulty,
      category: input.category?.trim(),
    }
    if (input.sheetText !== undefined) {
      const lines = parseSheet(input.sheetText)
      patch.lines = lines
      patch.chords = extractChords(lines)
    }
    const { error: err } = await supabase.from('songs').update(patch).eq('id', id)
    if (err) { error.value = err.message; return false }
    await fetchSongs()
    return true
  }

  async function deleteSong(id: string): Promise<boolean> {
    const { error: err } = await supabase.from('songs').delete().eq('id', id)
    if (err) { error.value = err.message; return false }
    songs.value = songs.value.filter((s) => s.id !== id)
    return true
  }

  async function getSong(id: string): Promise<Song | null> {
    const { data, error: err } = await supabase.from('songs').select('*').eq('id', id).single()
    if (err) { error.value = err.message; return null }
    return data as Song
  }

  return { songs, loading, error, fetchSongs, addSong, updateSong, deleteSong, getSong }
}

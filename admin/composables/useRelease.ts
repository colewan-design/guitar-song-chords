export interface Release {
  id: number
  version: string
  apk_url: string
  file_size: string | null
  changelog: string | null
  download_count: number
  created_at: string
}

export function useRelease() {
  const supabase = useSupabaseClient()
  const release = ref<Release | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRelease() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('app_releases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (err && err.code !== 'PGRST116') error.value = err.message
    release.value = data as Release | null
    loading.value = false
  }

  async function upsertRelease(input: Partial<Release>): Promise<boolean> {
    error.value = null
    if (release.value?.id) {
      const { error: err } = await supabase
        .from('app_releases')
        .update(input)
        .eq('id', release.value.id)
      if (err) { error.value = err.message; return false }
    } else {
      const { error: err } = await supabase
        .from('app_releases')
        .insert({ version: '1.0.0', apk_url: '', download_count: 0, ...input })
      if (err) { error.value = err.message; return false }
    }
    await fetchRelease()
    return true
  }

  return { release, loading, error, fetchRelease, upsertRelease }
}

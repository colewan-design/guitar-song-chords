import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  )

  // Fetch current release
  const { data: release, error: fetchErr } = await supabase
    .from('app_releases')
    .select('id, apk_url, download_count')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (fetchErr || !release) {
    throw createError({ statusCode: 404, message: 'No release found.' })
  }

  if (!release.apk_url) {
    throw createError({ statusCode: 404, message: 'APK not yet available.' })
  }

  // Atomically increment counter
  await supabase
    .from('app_releases')
    .update({ download_count: release.download_count + 1 })
    .eq('id', release.id)

  return { url: release.apk_url }
})

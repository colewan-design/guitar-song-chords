import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const parts = await readMultipartFormData(event)
  const filePart = parts?.find((p) => p.name === 'file')

  if (!filePart?.data) {
    throw createError({ statusCode: 400, message: 'No file provided.' })
  }

  const { error } = await supabase.storage
    .from('releases')
    .upload('app-release.apk', filePart.data, {
      upsert: true,
      contentType: 'application/vnd.android.package-archive',
    })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const { data } = supabase.storage.from('releases').getPublicUrl('app-release.apk')

  return { url: data.publicUrl }
})

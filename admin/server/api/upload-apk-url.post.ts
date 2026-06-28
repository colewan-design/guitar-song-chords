import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  )

  const { data, error } = await supabase.storage
    .from('releases')
    .createSignedUploadUrl('app-release.apk')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { signedUrl: data.signedUrl, token: data.token }
})

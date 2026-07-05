import { createClient } from '@supabase/supabase-js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body?.email?.trim().toLowerCase()

  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'Enter a valid email address.' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  )

  const { error } = await supabase
    .from('access_requests')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const { count } = await supabase
    .from('access_requests')
    .select('*', { count: 'exact', head: true })

  return { success: true, count: count ?? 0 }
})

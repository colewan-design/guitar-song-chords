import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  )

  const { data, error } = await supabase
    .from('access_requests')
    .select('email, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { requests: data ?? [] }
})

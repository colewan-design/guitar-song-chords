import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  )

  const { count } = await supabase
    .from('access_requests')
    .select('*', { count: 'exact', head: true })

  return { count: count ?? 0 }
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (!body?.code) {
    throw createError({ statusCode: 400, message: 'Code is required.' })
  }

  if (!config.adminCode) {
    throw createError({ statusCode: 500, message: 'Admin code not configured on server.' })
  }

  if (body.code !== config.adminCode) {
    return { valid: false, error: 'Invalid admin code.' }
  }

  return { valid: true }
})

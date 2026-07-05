export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const publicPaths = ['/login', '/register', '/download', '/privacy', '/terms', '/support']

  if (!user.value && !publicPaths.includes(to.path)) {
    return navigateTo('/login')
  }

  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }

  if (user.value && user.value.email_confirmed_at && to.path === '/register') {
    return navigateTo('/')
  }
})

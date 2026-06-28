export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const publicPaths = ['/login', '/register', '/download']

  if (!user.value && !publicPaths.includes(to.path)) {
    return navigateTo('/login')
  }

  if (user.value && user.value.email_confirmed_at && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})

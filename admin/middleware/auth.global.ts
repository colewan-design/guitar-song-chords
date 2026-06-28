export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const publicPaths = ['/login', '/register', '/download']

  if (!user.value && !publicPaths.includes(to.path)) {
    return navigateTo('/login')
  }

  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})

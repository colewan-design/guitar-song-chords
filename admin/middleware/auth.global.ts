export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const publicPaths = ['/login', '/register']

  if (!user.value && !publicPaths.includes(to.path)) {
    return navigateTo('/login')
  }

  if (user.value && publicPaths.includes(to.path)) {
    return navigateTo('/')
  }
})

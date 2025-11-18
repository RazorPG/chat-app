export default defineNuxtRouteMiddleware(to => {
  // Check if running on client side
  if (process.client) {
    const token = localStorage.getItem('token')
    const isAuthenticated = !!token

    // Auth pages that logged-in users shouldn't access
    const authPages = [
      '/login',
      '/register',
      '/verify-otp',
      '/forgot-password',
      '/verify-reset',
    ]

    // Protected pages that require authentication
    const protectedPages = ['/rooms', '/room']

    // If user is authenticated and trying to access auth pages, redirect to rooms
    if (isAuthenticated && authPages.includes(to.path)) {
      if (process.client) {
        window.location.href = '/rooms'
        return
      }
      return navigateTo('/rooms')
    }

    // If user is not authenticated and trying to access protected pages, redirect to login
    if (
      !isAuthenticated &&
      protectedPages.some(page => to.path.startsWith(page))
    ) {
      if (process.client) {
        window.location.href = '/login'
        return
      }
      return navigateTo('/login')
    }
  }

  // Redirect root path to appropriate page based on auth status
  if (to.path === '/') {
    if (process.client) {
      const token = localStorage.getItem('token')
      return navigateTo(token ? '/rooms' : '/login')
    }
    return navigateTo('/login')
  }
})

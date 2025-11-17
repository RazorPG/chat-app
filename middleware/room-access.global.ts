export default defineNuxtRouteMiddleware(async to => {
  // Only apply to room pages
  if (!to.path.startsWith('/room/')) return

  // Check if running on client side
  if (process.client) {
    const roomId = to.params.id as string

    // Decode token to get userId
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return navigateTo('/login')
      }

      const parts = token.split('.')
      if (parts.length !== 3) {
        return navigateTo('/login')
      }

      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      )
      const userId = payload.userId

      if (!userId) {
        return navigateTo('/login')
      }

      // Check if user is member of the room
      try {
        const room: any = await $fetch(`/api/rooms/${roomId}`)

        // Check if user is in members array
        const members = room?.members || []
        if (!members.includes(userId)) {
          alert(
            'You are not a member of this room. Please join with the room code first.'
          )
          return navigateTo('/rooms')
        }
      } catch (error) {
        console.error('Failed to check room access:', error)
        return navigateTo('/rooms')
      }
    } catch (error) {
      console.error('Token decode error:', error)
      return navigateTo('/login')
    }
  }
})

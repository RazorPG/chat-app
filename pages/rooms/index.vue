<template>
  <div class="min-h-screen p-3 bg-gray-50 md:p-6">
    <div class="max-w-3xl mx-auto">
      <!-- User Profile Header -->
      <div class="p-4 mb-4 bg-white rounded-lg shadow-sm md:mb-6 md:p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 md:gap-4">
            <!-- User Avatar -->
            <div
              class="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600 md:w-16 md:h-16 md:text-xl"
            >
              {{ userInitials }}
            </div>
            <!-- User Info -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 md:text-xl">
                {{ userName }}
              </h2>
              <p class="text-xs text-gray-500 md:text-sm">{{ userEmail }}</p>
            </div>
          </div>
          <!-- Logout Button -->
          <button
            @click="confirmLogout"
            class="px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 md:px-4 md:py-2 md:text-base"
          >
            Logout
          </button>
        </div>
        <!-- Welcome Message -->
        <div class="pt-4 mt-4 border-t">
          <p class="text-sm text-gray-700 md:text-base">
            👋 Welcome back! Ready to chat with your team?
          </p>
        </div>
      </div>

      <!-- Page Title -->
      <h1 class="mb-3 text-xl font-semibold md:mb-4 md:text-2xl">My Rooms</h1>

      <!-- Create Room Form -->
      <div class="p-3 mb-3 bg-white rounded-lg shadow md:p-4 md:mb-4">
        <h2 class="mb-2 text-base font-semibold md:mb-3 md:text-lg">
          Create New Room
        </h2>
        <form @submit.prevent="createRoom" class="flex gap-2">
          <input
            v-model="roomName"
            placeholder="Room name"
            class="flex-1 px-3 py-2 text-sm border rounded-lg md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            class="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg md:px-4 md:text-base hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      </div>

      <!-- Join Room Form -->
      <div class="p-3 mb-4 bg-white rounded-lg shadow md:p-4 md:mb-6">
        <h2 class="mb-2 text-base font-semibold md:mb-3 md:text-lg">
          Join Room with Code
        </h2>
        <form @submit.prevent="joinRoom" class="flex gap-2">
          <input
            v-model="joinCode"
            placeholder="Enter code (ABC123)"
            class="flex-1 px-3 py-2 text-sm uppercase border rounded-lg md:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            maxlength="6"
            required
          />
          <button
            class="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg md:px-4 md:text-base hover:bg-green-700"
          >
            Join
          </button>
        </form>
        <p v-if="joinError" class="mt-2 text-xs text-red-600 md:text-sm">
          {{ joinError }}
        </p>
        <p v-if="joinSuccess" class="mt-2 text-xs text-green-600 md:text-sm">
          {{ joinSuccess }}
        </p>
      </div>

      <!-- Rooms List -->
      <div class="p-3 bg-white rounded-lg shadow md:p-4">
        <h2 class="mb-2 text-base font-semibold md:mb-3 md:text-lg">
          Your Rooms
        </h2>
        <div v-if="rooms.length" class="space-y-2">
          <div
            v-for="r in rooms"
            :key="r._id"
            class="flex items-center justify-between gap-2 p-2.5 border rounded-lg hover:bg-gray-50 md:p-3 md:gap-3"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate md:text-base">{{ r.name }}</div>
              <div class="text-xs text-gray-600 md:text-sm">
                <span class="font-mono font-bold">{{ r.code }}</span>
                <span
                  v-if="r.onlineUsers?.length"
                  class="ml-2 text-green-600 md:ml-3"
                >
                  🟢
                  <span class="hidden md:inline"
                    >{{ r.onlineUsers.length }} online</span
                  >
                  <span class="md:hidden">{{ r.onlineUsers.length }}</span>
                </span>
              </div>
            </div>
            <NuxtLink
              :to="`/room/${r._id}`"
              class="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 md:px-4 md:py-2 md:text-base"
            >
              Open
            </NuxtLink>
          </div>
        </div>
        <p v-else class="py-8 text-sm text-center text-gray-600 md:text-base">
          No rooms yet. Create a room or join one with a code!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  const rooms = ref([])
  const roomName = ref('')
  const joinCode = ref('')
  const joinError = ref('')
  const joinSuccess = ref('')
  const currentUserId = ref(null)
  const userName = ref('')
  const userEmail = ref('')

  const userInitials = computed(() => {
    if (!userName.value) return '?'
    const parts = userName.value.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return userName.value.substring(0, 2).toUpperCase()
  })

  function decodeToken() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      )
      return payload
    } catch (e) {
      return null
    }
  }

  async function fetchRooms() {
    const userId = currentUserId.value
    if (!userId) return

    rooms.value = await $fetch(`/api/rooms?userId=${userId}`)
  }

  async function createRoom() {
    try {
      const result = await $fetch('/api/rooms/create', {
        method: 'POST',
        body: { name: roomName.value, creatorId: currentUserId.value },
      })
      roomName.value = ''
      await fetchRooms()
      alert(`Room created! Share this code: ${result.code}`)
    } catch (error) {
      alert('Failed to create room')
    }
  }

  async function joinRoom() {
    joinError.value = ''
    joinSuccess.value = ''

    try {
      const result = await $fetch('/api/rooms/join', {
        method: 'POST',
        body: { code: joinCode.value.trim(), userId: currentUserId.value },
      })

      if (result.alreadyMember) {
        joinSuccess.value = 'You are already a member of this room!'
      } else {
        joinSuccess.value = `Successfully joined "${result.room.name}"!`
      }

      joinCode.value = ''
      await fetchRooms()

      // Redirect to room after 1 second
      setTimeout(() => {
        navigateTo(`/room/${result.room._id}`)
      }, 1000)
    } catch (error) {
      joinError.value = error.data?.statusMessage || 'Invalid room code'
    }
  }

  function confirmLogout() {
    const ok = confirm('Are you sure you want to logout?')
    if (!ok) return
    try {
      localStorage.removeItem('token')
    } catch (e) {}
    navigateTo('/login')
  }

  onMounted(async () => {
    const payload = decodeToken()
    if (payload?.userId) {
      currentUserId.value = payload.userId
      // Fetch user data
      try {
        const user = await $fetch(`/api/users/${payload.userId}`)
        userName.value = user.name || 'User'
        userEmail.value = user.email || ''
      } catch (e) {
        console.error('Failed to fetch user data:', e)
        userName.value = 'User'
      }
    }
    await fetchRooms()
  })
</script>

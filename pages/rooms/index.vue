<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl">My Rooms</h1>
        <div>
          <button
            @click="confirmLogout"
            class="px-3 py-1 text-white bg-red-600 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Create Room Form -->
      <div class="p-4 mb-4 bg-white rounded-lg shadow">
        <h2 class="mb-3 text-lg font-semibold">Create New Room</h2>
        <form @submit.prevent="createRoom" class="flex gap-2">
          <input
            v-model="roomName"
            placeholder="Room name"
            class="flex-1 p-2 border rounded"
            required
          />
          <button class="px-4 text-white bg-blue-600 rounded hover:bg-blue-700">
            Create
          </button>
        </form>
      </div>

      <!-- Join Room Form -->
      <div class="p-4 mb-6 bg-white rounded-lg shadow">
        <h2 class="mb-3 text-lg font-semibold">Join Room with Code</h2>
        <form @submit.prevent="joinRoom" class="flex gap-2">
          <input
            v-model="joinCode"
            placeholder="Enter room code (e.g., ABC123)"
            class="flex-1 p-2 uppercase border rounded"
            maxlength="6"
            required
          />
          <button
            class="px-4 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Join
          </button>
        </form>
        <p v-if="joinError" class="mt-2 text-sm text-red-600">
          {{ joinError }}
        </p>
        <p v-if="joinSuccess" class="mt-2 text-sm text-green-600">
          {{ joinSuccess }}
        </p>
      </div>

      <!-- Rooms List -->
      <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="mb-3 text-lg font-semibold">Your Rooms</h2>
        <div v-if="rooms.length">
          <div
            v-for="r in rooms"
            :key="r._id"
            class="flex items-center justify-between p-3 mb-2 border rounded hover:bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ r.name }}</div>
              <div class="text-sm text-gray-600">
                Code: <span class="font-mono font-bold">{{ r.code }}</span>
                <span v-if="r.onlineUsers?.length" class="ml-3 text-green-600">
                  🟢 {{ r.onlineUsers.length }} online
                </span>
              </div>
            </div>
            <NuxtLink
              :to="`/room/${r._id}`"
              class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Open
            </NuxtLink>
          </div>
        </div>
        <p v-else class="text-gray-600">
          No rooms yet. Create a room or join one with a code!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  const rooms = ref([])
  const roomName = ref('')
  const joinCode = ref('')
  const joinError = ref('')
  const joinSuccess = ref('')
  const currentUserId = ref(null)

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
    }
    await fetchRooms()
  })
</script>

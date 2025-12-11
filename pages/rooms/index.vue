<template>
  <div
    class="relative w-full min-h-screen overflow-auto bg-gradient-to-br from-black via-gray-900 to-emerald-950"
  >
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-3xl animate-float"
      />
      <div
        class="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 blur-3xl animate-float-delayed"
      />
    </div>

    <!-- Grid pattern overlay -->
    <div
      class="fixed inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
    />

    <div class="relative max-w-4xl p-4 mx-auto md:p-8">
      <!-- Header with user info -->
      <div
        class="p-6 mb-6 border shadow-2xl bg-black/40 backdrop-blur-2xl border-emerald-500/20 rounded-3xl shadow-emerald-500/10 animate-fade-in-up"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center w-16 h-16 text-xl text-white border-2 rounded-full border-emerald-500/30 bg-gradient-to-br from-emerald-500 to-green-600"
            >
              {{ userInitials }}
            </div>
            <div>
              <h1 class="text-2xl text-white">{{ userName }}</h1>
              <p class="text-gray-400">{{ userEmail }}</p>
            </div>
          </div>
          <button
            @click="confirmLogout"
            class="flex items-center gap-2 px-4 py-2 text-red-400 transition-all border rounded-xl bg-black/30 border-red-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <!-- Welcome message -->
      <div
        class="flex items-center gap-3 p-4 mb-6 border bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/20 rounded-2xl backdrop-blur-sm animate-slide-in"
      >
        <svg
          class="w-6 h-6 text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p class="text-emerald-100">
          Welcome back! Ready to chat with your team?
        </p>
      </div>

      <!-- My Rooms Section -->
      <div class="mb-8">
        <h2 class="mb-4 text-2xl text-white">My Rooms</h2>

        <!-- Create New Room -->
        <div
          class="p-6 mb-6 transition-all border-2 border-dashed bg-black/40 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl"
        >
          <h3 class="flex items-center gap-2 mb-4 text-emerald-400">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Room
          </h3>
          <form
            @submit.prevent="createRoom"
            class="flex flex-col gap-3 sm:flex-row"
          >
            <input
              v-model="roomName"
              placeholder="Room name"
              class="flex-1 px-4 py-3 text-white transition-all border rounded-xl bg-black/30 border-emerald-500/30 placeholder:text-gray-500 focus:border-emerald-500 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
            />
            <button
              type="submit"
              class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Create
            </button>
          </form>
        </div>

        <!-- Join Room with Code -->
        <div
          class="p-6 mb-6 transition-all border-2 border-dashed bg-black/40 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl"
        >
          <h3 class="mb-4 text-emerald-400">Join Room with Code</h3>
          <form
            @submit.prevent="joinRoom"
            class="flex flex-col gap-3 sm:flex-row"
          >
            <input
              v-model="joinCode"
              placeholder="ENTER CODE (ABC123)"
              class="flex-1 px-4 py-3 text-white uppercase transition-all border rounded-xl bg-black/30 border-emerald-500/30 placeholder:text-gray-500 focus:border-emerald-500 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              maxlength="6"
              required
            />
            <button
              type="submit"
              class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl px-6 py-3 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Join
            </button>
          </form>
          <p
            v-if="joinError"
            class="p-3 mt-3 text-sm text-red-400 border bg-red-500/10 border-red-500/30 rounded-xl animate-shake"
          >
            {{ joinError }}
          </p>
          <p
            v-if="joinSuccess"
            class="p-3 mt-3 text-sm border bg-emerald-500/10 border-emerald-500/30 rounded-xl text-emerald-400"
          >
            {{ joinSuccess }}
          </p>
        </div>

        <!-- Your Rooms List -->
        <div>
          <h3 class="mb-4 text-white">Your Rooms</h3>
          <div v-if="rooms.length" class="space-y-3">
            <div
              v-for="r in rooms"
              :key="r._id"
              class="p-5 transition-all border bg-black/40 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 rounded-2xl"
            >
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-3 mb-2">
                    <h4 class="text-lg text-white">{{ r.name }}</h4>
                    <button
                      @click="copyCode(r.code)"
                      class="flex items-center gap-2 px-2 transition-colors rounded-lg h-7 hover:bg-emerald-500/20 text-emerald-400"
                    >
                      <code
                        class="px-2 py-1 text-sm rounded bg-emerald-500/20 text-emerald-300"
                      >
                        {{ r.code }}
                      </code>
                      <svg
                        v-if="copiedCode === r.code"
                        class="w-3 h-3 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-gray-400">
                    <div class="flex items-center gap-1">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>{{ r.members?.length || 0 }} members</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <div
                        :class="[
                          'w-2 h-2 rounded-full',
                          r.onlineUsers?.length > 0
                            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                            : 'bg-gray-600',
                        ]"
                      />
                      <span>{{ r.onlineUsers?.length || 0 }} online</span>
                    </div>
                  </div>
                </div>
                <NuxtLink
                  :to="`/room/${r._id}`"
                  class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 text-white font-medium px-6 py-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Open
                </NuxtLink>
              </div>
            </div>
          </div>
          <div
            v-else
            class="p-8 border bg-black/40 backdrop-blur-xl border-emerald-500/20 rounded-2xl"
          >
            <p class="text-center text-gray-400">
              No rooms yet. Create a room or join one with a code!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const rooms = ref([])
  const roomName = ref('')
  const joinCode = ref('')
  const joinError = ref('')
  const joinSuccess = ref('')
  const currentUserId = ref(null)
  const userName = ref('')
  const userEmail = ref('')
  const copiedCode = ref(null)

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
        router.push(`/room/${result.room._id}`)
      }, 1000)
    } catch (error) {
      joinError.value = error.data?.statusMessage || 'Invalid room code'
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code)
    copiedCode.value = code
    setTimeout(() => {
      copiedCode.value = null
    }, 2000)
  }

  function confirmLogout() {
    const ok = confirm('Are you sure you want to logout?')
    if (!ok) return
    try {
      localStorage.removeItem('token')
    } catch (e) {}
    router.push('/login')
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

<style scoped>
  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(100px, 50px) scale(1.2);
    }
    66% {
      transform: translate(50px, -30px) scale(1.1);
    }
  }

  @keyframes float-delayed {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-100px, -50px) scale(1.3);
    }
    66% {
      transform: translate(-50px, 30px) scale(1.15);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-10px);
    }
    75% {
      transform: translateX(10px);
    }
  }

  .animate-float {
    animation: float 20s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 15s ease-in-out infinite;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-slide-in {
    animation: slideIn 0.6s ease-out;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
</style>

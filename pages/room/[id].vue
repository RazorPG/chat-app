<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <div class="flex flex-col w-full h-full mx-auto md:max-w-4xl">
      <!-- Header -->
      <div
        class="flex items-center justify-between px-3 py-3 bg-white border-b shadow-sm md:px-6 md:py-4"
      >
        <div class="flex items-center flex-1 min-w-0 gap-2 md:gap-3">
          <NuxtLink
            to="/rooms"
            class="flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-600 transition rounded-full md:w-10 md:h-10 hover:bg-gray-100"
            title="Back to rooms"
          >
            <XMarkIcon class="w-5 h-5 md:w-6 md:h-6" />
          </NuxtLink>
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-semibold truncate md:text-2xl">
              {{ room?.name }}
            </h1>
            <div
              class="flex items-center gap-1 text-xs text-gray-600 md:gap-2 md:text-sm"
            >
              <span class="font-mono truncate">Code: {{ room?.code }}</span>
              <span class="text-gray-400">•</span>
              <span class="flex items-center gap-1">
                <span
                  class="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"
                ></span>
                {{ onlineCount }} online
              </span>
              <span class="text-gray-400">•</span>
              <button
                @click="showMembersModal = true"
                class="transition cursor-pointer hover:text-blue-600 hover:underline"
              >
                {{ memberCount }} members
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Area (Scrollable) -->
      <div class="flex-1 px-3 py-2 overflow-auto md:p-4" ref="messagesEl">
        <div v-for="m in messages" :key="m._id" class="mb-2 md:mb-3">
          <div
            :class="
              m.senderId === currentUserId
                ? 'flex justify-end'
                : 'flex justify-start'
            "
          >
            <div
              :class="[
                'max-w-[85%] md:max-w-lg',
                m.senderId === currentUserId ? 'text-right' : 'text-left',
              ]"
            >
              <div
                :class="[
                  'text-xs text-gray-500',
                  m.senderId === currentUserId ? 'text-right' : 'text-left',
                ]"
              >
                {{ formatTime(m.createdAt) }}
              </div>
              <div
                :class="[
                  'mt-1 inline-block p-2 md:p-3 rounded',
                  m.senderId === currentUserId
                    ? 'bg-blue-600 text-white rounded-lg text-left'
                    : 'bg-white text-gray-900 rounded-lg text-left shadow-sm',
                ]"
              >
                <div class="mb-1 text-xs font-semibold md:mb-1.5">
                  {{
                    m.senderName ||
                    (m.senderId === currentUserId ? 'You' : 'Unknown')
                  }}
                </div>
                <div>{{ m.text }}</div>
                <!-- Location Message with Preview -->
                <div
                  v-if="m.location"
                  class="mt-2 overflow-hidden transition-shadow bg-white border rounded-lg cursor-pointer hover:shadow-lg"
                  @click="openMap(m.location)"
                >
                  <!-- Map Preview (Static Image) -->
                  <div class="relative w-full h-48 bg-gray-100">
                    <img
                      :src="`https://staticmap.openstreetmap.de/staticmap.php?center=${m.location.lat},${m.location.lng}&zoom=14&size=400x200&maptype=mapnik&markers=${m.location.lat},${m.location.lng},red-pushpin`"
                      alt="Location preview"
                      class="object-cover w-full h-full"
                      loading="lazy"
                      @error="e => (e.target.style.display = 'none')"
                    />
                    <div
                      class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 to-transparent"
                    >
                      <div
                        class="px-4 py-2 text-sm font-medium text-white bg-black rounded-full bg-opacity-70 backdrop-blur-sm"
                      >
                        🗺️ Click to view interactive map
                      </div>
                    </div>
                  </div>
                  <!-- Location Info -->
                  <div class="flex items-center gap-2 p-3 bg-gray-50">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-gray-900 truncate">
                        📍 Location shared
                      </div>
                      <div class="font-mono text-xs text-gray-500">
                        {{ m.location.lat.toFixed(4) }}°,
                        {{ m.location.lng.toFixed(4) }}°
                      </div>
                    </div>
                    <div class="text-xs font-medium text-blue-600">View →</div>
                  </div>
                </div>
                <div v-if="m.mediaUrl" class="mt-2">
                  <img
                    v-if="m.mediaType?.startsWith('image')"
                    :src="m.mediaUrl"
                    class="max-w-xs"
                  />
                  <video
                    v-else-if="m.mediaType?.startsWith('video')"
                    :src="m.mediaUrl"
                    controls
                    class="max-w-md"
                  ></video>
                  <div v-else class="text-sm">
                    <a
                      :href="m.mediaUrl"
                      class="text-blue-600 underline"
                      target="_blank"
                      rel="noopener"
                      >Download file</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Form (Fixed at Bottom) -->
      <form
        @submit.prevent="sendMessage"
        class="flex gap-1.5 md:gap-2 p-3 md:p-4 bg-white border-t"
      >
        <input
          v-model="text"
          placeholder="Type a message..."
          class="flex-1 px-3 py-2 text-sm border rounded-full md:text-base md:px-4 md:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="sending"
        />
        <!-- Hidden native file input -->
        <input
          ref="fileInput"
          type="file"
          @change="onFile"
          :disabled="sending"
          class="hidden"
        />
        <!-- Modern file button with paperclip icon -->
        <button
          type="button"
          @click="triggerFile"
          :disabled="sending"
          class="flex items-center justify-center flex-shrink-0 text-gray-600 transition border border-gray-300 rounded-full w-9 h-9 md:w-10 md:h-10 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
        >
          <PaperClipIcon class="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <!-- Location button -->
        <button
          type="button"
          @click="shareLocation"
          :disabled="sending"
          class="flex items-center justify-center flex-shrink-0 text-gray-600 transition border border-gray-300 rounded-full w-9 h-9 md:w-10 md:h-10 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Share location"
        >
          <svg
            class="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <button
          class="flex-shrink-0 px-3 py-2 text-sm font-medium text-white rounded-full md:px-5 md:text-base"
          :class="
            sending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          "
          :disabled="sending"
        >
          <span class="hidden md:inline">{{
            sending ? 'Sending...' : 'Send'
          }}</span>
          <svg
            class="w-5 h-5 md:hidden"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>

    <!-- Map Modal -->
    <div
      v-if="showMap"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click="closeMap"
    >
      <div
        class="relative w-full max-w-2xl p-3 bg-white rounded-lg shadow-xl md:p-4"
        @click.stop
      >
        <button
          @click="closeMap"
          class="absolute z-10 flex items-center justify-center w-8 h-8 text-gray-600 bg-white rounded-full shadow top-2 right-2 hover:bg-gray-100"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
        <div id="map" class="w-full h-64 rounded-lg md:h-96"></div>
        <div class="mt-3 text-center">
          <a
            :href="`https://www.google.com/maps?q=${selectedLocation?.lat},${selectedLocation?.lng}`"
            target="_blank"
            rel="noopener"
            class="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 md:text-base"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>

    <!-- Members Modal -->
    <div
      v-if="showMembersModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click="showMembersModal = false"
    >
      <div
        class="relative w-full max-w-md p-4 bg-white rounded-lg shadow-xl md:p-6"
        @click.stop
      >
        <button
          @click="showMembersModal = false"
          class="absolute z-10 flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-100 rounded-full top-2 right-2 md:top-3 md:right-3 hover:bg-gray-200"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <h2 class="mb-3 text-lg font-semibold text-gray-900 md:mb-4 md:text-xl">
          Room Members ({{ membersList.length }})
        </h2>

        <div class="overflow-y-auto max-h-72 md:max-h-96">
          <div
            v-if="membersList.length === 0"
            class="py-8 text-center text-gray-500"
          >
            No members found
          </div>
          <div
            v-for="member in membersList"
            :key="member._id"
            class="flex items-center gap-3 p-3 mb-2 border rounded-lg hover:bg-gray-50"
          >
            <!-- Avatar -->
            <div
              class="flex items-center justify-center flex-shrink-0 w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
            >
              {{ getInitials(member.name) }}
            </div>

            <!-- Member Info -->
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate">
                {{ member.name }}
              </div>
            </div>

            <!-- Online Status -->
            <div class="flex items-center flex-shrink-0 gap-1">
              <span
                :class="[
                  'w-2 h-2 rounded-full',
                  isOnline(member._id)
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-gray-300',
                ]"
              ></span>
              <span class="text-xs text-gray-600">
                {{ isOnline(member._id) ? 'Online' : 'Offline' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { PaperClipIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  const route = useRoute()
  const room = ref(null)
  const messages = ref([])
  const text = ref('')
  const currentUserId = ref(null)
  const file = ref(null)
  const messagesEl = ref(null)
  let pollInterval = null
  const fileInput = ref(null)
  const sending = ref(false)
  const onlineCount = ref(0)
  const memberCount = ref(0)
  const showMap = ref(false)
  const selectedLocation = ref(null)
  const showMembersModal = ref(false)
  const membersList = ref([])
  let map = null

  async function load() {
    room.value = await $fetch(`/api/rooms/${route.params.id}`)
    messages.value = await $fetch(`/api/rooms/${route.params.id}/messages`)
    onlineCount.value = room.value?.onlineUsers?.length || 0
    memberCount.value = room.value?.members?.length || 0
    await loadMembers()
    scrollBottom()
  }

  async function loadMembers() {
    if (!room.value?.members || room.value.members.length === 0) {
      membersList.value = []
      return
    }

    try {
      // Fetch user details for all members
      const members = await Promise.all(
        room.value.members.map(async memberId => {
          try {
            const user = await $fetch(`/api/users/${memberId}`)
            return user
          } catch (e) {
            return { _id: memberId, name: 'Unknown User', email: '' }
          }
        })
      )
      membersList.value = members.filter(m => m)
    } catch (error) {
      console.error('Failed to load members:', error)
      membersList.value = []
    }
  }

  function getInitials(name) {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  function isOnline(userId) {
    return room.value?.onlineUsers?.includes(userId) || false
  }

  async function updateOnlineStatus(action) {
    if (!currentUserId.value) return
    try {
      const result = await $fetch(`/api/rooms/${route.params.id}/online`, {
        method: 'POST',
        body: { userId: currentUserId.value, action },
      })
      onlineCount.value = result.onlineCount
    } catch (e) {
      console.error('Failed to update online status:', e)
    }
  }

  function formatTime(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    return `${day}/${month}/${year} ${hours}:${minutesStr} ${ampm}`
  }

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

  function onFile(e) {
    file.value = e.target.files[0]
  }

  function triggerFile() {
    if (fileInput.value) fileInput.value.click()
  }

  async function shareLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    if (sending.value) return

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          sending.value = true
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          const body = {
            text: '📍 Shared a location',
            location,
            senderId: currentUserId.value,
          }

          await $fetch(`/api/rooms/${route.params.id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          })

          await load()
        } catch (error) {
          console.error('Share location error:', error)
          alert('Failed to share location')
        } finally {
          sending.value = false
        }
      },
      error => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please enable location access.')
      }
    )
  }

  function openMap(location) {
    selectedLocation.value = location
    showMap.value = true

    nextTick(() => {
      if (process.client && !map) {
        import('leaflet').then(L => {
          // Initialize map
          map = L.default.map('map').setView([location.lat, location.lng], 15)

          // Add OpenStreetMap tiles
          L.default
            .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            })
            .addTo(map)

          // Add marker
          L.default.marker([location.lat, location.lng]).addTo(map)

          // Refresh map size
          setTimeout(() => map.invalidateSize(), 100)
        })
      } else if (map) {
        map.setView([location.lat, location.lng], 15)
        setTimeout(() => map.invalidateSize(), 100)
      }
    })
  }

  function closeMap() {
    showMap.value = false
    if (map) {
      map.remove()
      map = null
    }
  }

  async function sendMessage() {
    const payload = decodeToken()
    if (payload?.userId) currentUserId.value = payload.userId

    // Validasi: tidak boleh kirim jika text kosong dan tidak ada file
    if (!text.value.trim() && !file.value) {
      alert('Pesan tidak boleh kosong')
      return
    }

    if (sending.value) return // Prevent double submit

    try {
      sending.value = true

      if (file.value) {
        const form = new FormData()
        form.append('text', text.value)
        if (currentUserId.value) form.append('senderId', currentUserId.value)
        form.append('media', file.value)
        await $fetch(`/api/rooms/${route.params.id}/messages`, {
          method: 'POST',
          body: form,
        })
      } else {
        // send as JSON so Nitro's readBody can parse `text`
        const body = { text: text.value }
        if (currentUserId.value) body.senderId = currentUserId.value
        await $fetch(`/api/rooms/${route.params.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
      }
      text.value = ''
      fileInput.value.value = null
      file.value = null
      await load()
    } catch (error) {
      console.error('Send message error:', error)
      alert(
        'Gagal mengirim pesan: ' +
          (error.data?.message || error.message || 'Unknown error')
      )
    } finally {
      sending.value = false
    }
  }

  function scrollBottom() {
    nextTick(() => {
      if (messagesEl.value)
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    })
  }

  onMounted(load)

  // set current user id from token and mark as online
  onMounted(async () => {
    const p = decodeToken()
    if (p?.userId) {
      currentUserId.value = p.userId
      // Mark user as online when entering room
      await updateOnlineStatus('join')
    }
    // remember last room to allow quick return from /rooms
    try {
      localStorage.setItem('lastRoomId', route.params.id)
    } catch (e) {}
  })

  // start polling for new messages and online count
  onMounted(() => {
    // poll every 2 seconds
    pollInterval = setInterval(async () => {
      try {
        const newMsgs = await $fetch(`/api/rooms/${route.params.id}/messages`)
        const oldLast = messages.value?.length
          ? messages.value[messages.value.length - 1]._id
          : null
        const newLast = newMsgs?.length ? newMsgs[newMsgs.length - 1]._id : null
        if (newLast !== oldLast) {
          messages.value = newMsgs
          scrollBottom()
        }

        // Update online count and member count
        const roomData = await $fetch(`/api/rooms/${route.params.id}`)
        const prevOnlineCount = onlineCount.value
        const prevMemberCount = memberCount.value

        onlineCount.value = roomData?.onlineUsers?.length || 0
        memberCount.value = roomData?.members?.length || 0
        room.value = roomData

        // Reload members if count changed
        if (
          prevMemberCount !== memberCount.value ||
          prevOnlineCount !== onlineCount.value
        ) {
          await loadMembers()
        }
      } catch (e) {
        // ignore polling errors
        console.error('Polling error', e)
      }
    }, 2000)
  })

  // Mark user as offline when leaving
  onUnmounted(async () => {
    if (pollInterval) clearInterval(pollInterval)
    await updateOnlineStatus('leave')
  })

  // Also handle page unload/close
  if (process.client) {
    window.addEventListener('beforeunload', () => {
      if (currentUserId.value) {
        navigator.sendBeacon(
          `/api/rooms/${route.params.id}/online`,
          JSON.stringify({ userId: currentUserId.value, action: 'leave' })
        )
      }
    })
  }
</script>

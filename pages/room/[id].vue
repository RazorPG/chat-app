<template>
  <div class="flex flex-col h-screen">
    <div class="flex flex-col w-full h-full max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 pb-4 border-b">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/rooms"
            class="flex items-center justify-center w-10 h-10 text-gray-600 transition rounded-full hover:bg-gray-100"
            title="Back to rooms"
          >
            <XMarkIcon class="w-6 h-6" />
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-semibold">{{ room?.name }}</h1>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span class="font-mono">Code: {{ room?.code }}</span>
              <span class="text-gray-400">•</span>
              <span class="flex items-center gap-1">
                <span
                  class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                ></span>
                {{ onlineCount }} online
              </span>
              <span class="text-gray-400">•</span>
              <span>{{ memberCount }} members</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Area (Scrollable) -->
      <div class="flex-1 p-4 overflow-auto border-t border-b" ref="messagesEl">
        <div v-for="m in messages" :key="m._id" class="mb-3">
          <div
            :class="
              m.senderId === currentUserId
                ? 'flex justify-end'
                : 'flex justify-start'
            "
          >
            <div
              :class="[
                'max-w-lg',
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
                  'mt-1 inline-block p-2 rounded',
                  m.senderId === currentUserId
                    ? 'bg-blue-600 text-white rounded-lg text-left'
                    : 'bg-gray-100 text-gray-900 rounded-lg text-left',
                ]"
              >
                <div class="mb-1 text-xs font-semibold">
                  {{
                    m.senderName ||
                    (m.senderId === currentUserId ? 'You' : 'Unknown')
                  }}
                </div>
                <div>{{ m.text }}</div>
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
      <form @submit.prevent="sendMessage" class="flex gap-2 p-6 pt-4">
        <input
          v-model="text"
          placeholder="Message"
          class="flex-1 p-2 border rounded"
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
          class="flex items-center justify-center w-10 h-10 text-gray-600 transition border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
        >
          <PaperClipIcon class="w-5 h-5" />
        </button>
        <span
          v-if="file"
          class="max-w-[140px] truncate text-xs self-center text-gray-500"
          >{{ file.name }}</span
        >
        <button
          class="px-4 text-white rounded"
          :class="sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'"
          :disabled="sending"
        >
          {{ sending ? 'Mengirim...' : 'Send' }}
        </button>
      </form>
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

  async function load() {
    room.value = await $fetch(`/api/rooms/${route.params.id}`)
    messages.value = await $fetch(`/api/rooms/${route.params.id}/messages`)
    onlineCount.value = room.value?.onlineUsers?.length || 0
    memberCount.value = room.value?.members?.length || 0
    scrollBottom()
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
        onlineCount.value = roomData?.onlineUsers?.length || 0
        memberCount.value = roomData?.members?.length || 0
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

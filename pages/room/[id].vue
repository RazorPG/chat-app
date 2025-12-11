<template>
  <div
    class="relative flex flex-col w-full h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-emerald-950"
  >
    <!-- Animated background elements - subtle for chat -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 blur-3xl animate-float-subtle"
      />
      <div
        class="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 blur-3xl animate-float-subtle-delayed"
      />
    </div>

    <!-- Header -->
    <div
      class="relative z-50 border-b shadow-lg bg-black/40 backdrop-blur-2xl border-emerald-500/20 shadow-emerald-500/5"
    >
      <div class="flex items-center gap-4 p-4">
        <button
          @click="$router.push('/rooms')"
          class="flex items-center justify-center w-10 h-10 transition-colors rounded-full hover:bg-emerald-500/20 text-emerald-400"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h2 class="text-lg text-white truncate">{{ room?.name }}</h2>
            <button
              @click="copyRoomCode"
              class="flex items-center h-6 gap-1 px-2 transition-colors rounded-lg hover:bg-emerald-500/20 text-emerald-400"
            >
              <code
                class="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300"
              >
                Code: {{ room?.code }}
              </code>
              <svg
                v-if="codeCopied"
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
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  onlineCount > 0
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                    : 'bg-gray-600',
                ]"
              />
              <span>{{ onlineCount }} online</span>
            </div>
            <span>•</span>
            <button
              @click="showMembersModal = true"
              class="flex items-center gap-1 transition-colors hover:text-emerald-400"
            >
              <svg
                class="w-3 h-3"
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
              <span>{{ memberCount }} members</span>
            </button>
          </div>
        </div>

        <button
          @click="showDropdown = !showDropdown"
          class="relative flex items-center justify-center w-10 h-10 transition-colors rounded-full dropdown-container hover:bg-emerald-500/20 text-emerald-400"
        >
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
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>

          <!-- Dropdown menu -->
          <div
            v-if="showDropdown"
            class="fixed z-[9999] w-48 py-2 border shadow-xl bg-black/90 backdrop-blur-xl border-emerald-500/20 rounded-xl"
            :style="{ top: '72px', right: '16px' }"
          >
            <button
              @click="handleCopyRoomCode"
              class="flex items-center w-full gap-2 px-4 py-2 text-left text-white transition-colors hover:bg-emerald-500/20"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Room Code
            </button>
            <button
              @click="handleViewMembers"
              class="flex items-center w-full gap-2 px-4 py-2 text-left text-white transition-colors hover:bg-emerald-500/20"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              View Members
            </button>
            <button
              @click="handleLogout"
              class="flex items-center w-full gap-2 px-4 py-2 text-left text-red-400 transition-colors hover:bg-red-500/20"
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
        </button>
      </div>
    </div>

    <!-- Messages Area (Scrollable) -->
    <div class="relative flex-1 p-4 space-y-4 overflow-y-auto" ref="messagesEl">
      <div
        v-for="(m, index) in messages"
        :key="m._id"
        :class="[
          'flex',
          m.senderId === currentUserId ? 'justify-end' : 'justify-start',
        ]"
      >
        <!-- Avatar for other users -->
        <div
          v-if="m.senderId !== currentUserId"
          class="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 mr-2 text-xs text-white border rounded-full border-emerald-500/30 bg-gradient-to-br from-emerald-600 to-green-700"
        >
          {{ getInitials(m.senderName || 'Unknown') }}
        </div>

        <div
          :class="[
            m.location ? 'max-w-sm lg:max-w-lg' : 'max-w-xs lg:max-w-md',
            'flex flex-col',
            m.senderId === currentUserId ? 'items-end' : 'items-start',
          ]"
        >
          <!-- Sender name for other users -->
          <span
            v-if="m.senderId !== currentUserId"
            class="mb-1 ml-1 text-xs text-gray-400"
            >{{ m.senderName || 'Unknown' }}</span
          >

          <div
            :class="[
              'px-4 py-2 rounded-2xl',
              m.senderId === currentUserId
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-br-sm shadow-lg shadow-emerald-500/30'
                : 'bg-black/40 backdrop-blur-xl text-white rounded-bl-sm shadow-lg border border-emerald-500/20',
            ]"
          >
            <!-- Location preview with map -->
            <div
              v-if="m.location"
              class="w-full overflow-hidden rounded-lg cursor-pointer"
              @click="openMap(m.location)"
            >
              <div
                class="relative w-full bg-gradient-to-br from-gray-700 to-gray-800"
              >
                <iframe
                  :src="`https://maps.google.com/maps?q=${m.location.lat},${m.location.lng}&z=15&output=embed`"
                  class="w-full h-48 pointer-events-none"
                  frameborder="0"
                  scrolling="no"
                ></iframe>
                <div
                  class="absolute flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full shadow-lg bottom-3 left-3 bg-black/80 backdrop-blur-md"
                >
                  <svg
                    class="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-white">Click to view</span>
                </div>
              </div>
            </div>

            <!-- Text message (only show if not location) -->
            <p v-else-if="m.text">{{ m.text }}</p>

            <!-- Media attachments -->
            <div v-if="m.mediaUrl" class="mt-2">
              <img
                v-if="m.mediaType?.startsWith('image')"
                :src="m.mediaUrl"
                class="w-full h-auto max-w-full rounded"
              />
              <video
                v-else-if="m.mediaType?.startsWith('video')"
                :src="m.mediaUrl"
                controls
                class="w-full h-auto max-w-full rounded"
              ></video>
              <div v-else class="text-sm">
                <a
                  :href="m.mediaUrl"
                  class="underline hover:text-emerald-300"
                  target="_blank"
                  rel="noopener"
                  >Download file</a
                >
              </div>
            </div>

            <p
              :class="[
                'text-xs mt-1',
                m.senderId === currentUserId
                  ? 'text-white/70'
                  : 'text-gray-400',
              ]"
            >
              {{ formatTime(m.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div
      class="relative p-4 border-t bg-black/40 backdrop-blur-2xl border-emerald-500/20"
    >
      <!-- File Preview -->
      <div
        v-if="file"
        class="p-3 mb-3 border bg-black/30 backdrop-blur-xl border-emerald-500/20 rounded-xl"
      >
        <div class="flex items-start gap-3">
          <div class="relative flex-shrink-0">
            <!-- Image preview -->
            <img
              v-if="filePreview && file.type.startsWith('image/')"
              :src="filePreview"
              class="object-cover w-20 h-20 rounded-lg"
            />
            <!-- Video preview -->
            <video
              v-else-if="filePreview && file.type.startsWith('video/')"
              :src="filePreview"
              class="object-cover w-20 h-20 rounded-lg"
              muted
            />
            <!-- GIF/Other file icon -->
            <div
              v-else
              class="flex items-center justify-center w-20 h-20 rounded-lg bg-emerald-500/20"
            >
              <svg
                v-if="file.type.startsWith('video/')"
                class="w-8 h-8 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <svg
                v-else
                class="w-8 h-8 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-white truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
          </div>
          <button
            type="button"
            @click="cancelFile"
            class="flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-400 transition-colors rounded-full hover:bg-red-500/20"
            title="Cancel"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="flex items-center gap-2">
        <button
          type="button"
          @click="triggerFile"
          :disabled="sending || file"
          class="flex items-center justify-center w-10 h-10 transition-colors rounded-full hover:bg-emerald-500/20 text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
        >
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
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <!-- Hidden file input -->
        <input
          ref="fileInput"
          type="file"
          @change="onFile"
          :disabled="sending"
          class="hidden"
          accept="image/*,video/*,.gif"
        />

        <div class="relative flex-1">
          <input
            v-model="text"
            placeholder="Type a message..."
            class="w-full px-4 py-3 pr-10 text-white transition-all border rounded-full bg-black/30 border-emerald-500/30 placeholder:text-gray-500 focus:border-emerald-500 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            :disabled="sending || file"
          />
          <button
            type="button"
            @click="shareLocation"
            :disabled="sending || file"
            class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-full right-1 top-1/2 hover:bg-emerald-500/20 text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Share location"
          >
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
        </div>

        <button
          type="submit"
          :disabled="(!text.trim() && !file) || sending"
          class="flex items-center justify-center w-10 h-10 transition-all rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            class="w-5 h-5 text-white"
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
  </div>

  <!-- Map Modal -->
  <div
    v-if="showMap"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    @click="closeMap"
  >
    <div
      class="relative w-full max-w-2xl p-4 border shadow-2xl bg-black/90 backdrop-blur-xl border-emerald-500/20 rounded-2xl shadow-emerald-500/10"
      @click.stop
    >
      <button
        @click="closeMap"
        class="absolute z-10 flex items-center justify-center w-8 h-8 transition-colors border rounded-full text-emerald-400 bg-black/50 backdrop-blur-xl border-emerald-500/30 top-2 right-2 hover:bg-emerald-500/20"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div id="map" class="w-full h-64 rounded-xl md:h-96"></div>
      <div class="mt-3 text-center">
        <a
          :href="`https://www.google.com/maps?q=${selectedLocation?.lat},${selectedLocation?.lng}`"
          target="_blank"
          rel="noopener"
          class="inline-block px-4 py-2 text-sm font-medium text-white transition-all shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl shadow-emerald-500/30 md:text-base"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  </div>

  <!-- Members Modal -->
  <div
    v-if="showMembersModal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    @click="showMembersModal = false"
  >
    <div
      class="relative w-full max-w-md p-6 border shadow-2xl bg-black/90 backdrop-blur-xl border-emerald-500/20 rounded-2xl shadow-emerald-500/10"
      @click.stop
    >
      <button
        @click="showMembersModal = false"
        class="absolute z-10 flex items-center justify-center w-8 h-8 transition-colors border rounded-full text-emerald-400 bg-black/50 backdrop-blur-xl border-emerald-500/30 top-3 right-3 hover:bg-emerald-500/20"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 class="mb-4 text-xl font-semibold text-white">
        Room Members ({{ membersList.length }})
      </h2>

      <div class="overflow-y-auto max-h-96">
        <div
          v-if="membersList.length === 0"
          class="py-8 text-center text-gray-400"
        >
          No members found
        </div>
        <div
          v-for="member in membersList"
          :key="member._id"
          class="flex items-center gap-3 p-3 mb-2 transition-all border bg-black/40 backdrop-blur-xl border-emerald-500/20 rounded-xl hover:border-emerald-500/40"
        >
          <!-- Avatar -->
          <div
            class="flex items-center justify-center flex-shrink-0 w-10 h-10 font-semibold text-white border rounded-full bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-500/30"
          >
            {{ getInitials(member.name) }}
          </div>

          <!-- Member Info -->
          <div class="flex-1 min-w-0">
            <div class="font-medium text-white truncate">
              {{ member.name }}
            </div>
          </div>

          <!-- Online Status -->
          <div class="flex items-center flex-shrink-0 gap-1">
            <span
              :class="[
                'w-2 h-2 rounded-full',
                isOnline(member._id)
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                  : 'bg-gray-600',
              ]"
            ></span>
            <span class="text-xs text-gray-400">
              {{ isOnline(member._id) ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()
  const room = ref(null)
  const messages = ref([])
  const text = ref('')
  const currentUserId = ref(null)
  const file = ref(null)
  const filePreview = ref(null)
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
  const showDropdown = ref(false)
  const codeCopied = ref(false)
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

  function copyRoomCode() {
    if (room.value?.code) {
      navigator.clipboard.writeText(room.value.code)
      codeCopied.value = true
      setTimeout(() => {
        codeCopied.value = false
      }, 2000)
    }
  }

  function handleCopyRoomCode() {
    copyRoomCode()
    showDropdown.value = false
  }

  function handleViewMembers() {
    showMembersModal.value = true
    showDropdown.value = false
  }

  function handleLogout() {
    const ok = confirm('Are you sure you want to logout?')
    if (!ok) return
    try {
      localStorage.removeItem('token')
    } catch (e) {}
    showDropdown.value = false
    router.push('/login')
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
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type - only allow images, videos, and GIFs
      const validTypes = ['image/', 'video/']
      const isValid = validTypes.some(type =>
        selectedFile.type.startsWith(type)
      )

      if (!isValid) {
        alert('Hanya file gambar, video, dan GIF yang diperbolehkan!')
        if (fileInput.value) {
          fileInput.value.value = ''
        }
        return
      }

      file.value = selectedFile

      // Create preview for images and videos
      if (
        selectedFile.type.startsWith('image/') ||
        selectedFile.type.startsWith('video/')
      ) {
        const reader = new FileReader()
        reader.onload = e => {
          filePreview.value = e.target.result
        }
        reader.readAsDataURL(selectedFile)
      }
    }
  }

  function cancelFile() {
    file.value = null
    filePreview.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
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

          // Create custom red icon
          const redIcon = L.default.icon({
            iconUrl:
              'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })

          // Add marker with red icon
          L.default
            .marker([location.lat, location.lng], { icon: redIcon })
            .addTo(map)
            .bindPopup('📍 Shared Location')
            .openPopup()

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
      file.value = null
      filePreview.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
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

  // Close dropdown when clicking outside
  if (process.client) {
    const handleClickOutside = e => {
      // Check if click is outside the dropdown container
      const dropdownContainer = e.target.closest('.dropdown-container')
      if (showDropdown.value && !dropdownContainer) {
        showDropdown.value = false
      }
    }

    document.addEventListener('click', handleClickOutside)
  }
</script>

<style scoped>
  @keyframes float-subtle {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(50px, 30px) scale(1.1);
    }
    66% {
      transform: translate(30px, -20px) scale(1.05);
    }
  }

  @keyframes float-subtle-delayed {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-50px, -30px) scale(1.15);
    }
    66% {
      transform: translate(-30px, 20px) scale(1.08);
    }
  }

  .animate-float-subtle {
    animation: float-subtle 20s ease-in-out infinite;
  }

  .animate-float-subtle-delayed {
    animation: float-subtle-delayed 15s ease-in-out infinite;
  }
</style>

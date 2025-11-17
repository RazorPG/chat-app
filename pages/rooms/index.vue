<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl">Rooms</h1>
        <div>
          <button
            @click="confirmLogout"
            class="bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <form @submit.prevent="createRoom" class="mb-4 flex gap-2">
        <input
          v-model="roomName"
          placeholder="Room name"
          class="flex-1 p-2 border rounded"
        />
        <button class="bg-blue-600 text-white px-4 rounded">Create</button>
      </form>

      <div v-if="rooms.length">
        <div
          v-for="r in rooms"
          :key="r._id"
          class="p-3 border rounded mb-2 flex justify-between items-center"
        >
          <div>
            <div class="font-medium">{{ r.name }}</div>
            <div class="text-sm text-gray-600">Code: {{ r.code }}</div>
          </div>
          <NuxtLink :to="`/room/${r._id}`" class="text-blue-600">Open</NuxtLink>
        </div>
      </div>
      <p v-else class="text-gray-600">No rooms yet.</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  const rooms = ref([])
  const roomName = ref('')

  async function fetchRooms() {
    rooms.value = await $fetch('/api/rooms')
  }

  async function createRoom() {
    await $fetch('/api/rooms/create', {
      method: 'POST',
      body: { name: roomName.value },
    })
    roomName.value = ''
    await fetchRooms()
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
    await fetchRooms()
  })
</script>

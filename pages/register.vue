<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-6 rounded shadow">
      <h1 class="text-2xl mb-4">Register</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input v-model="name" placeholder="Name" class="w-full p-2 border rounded" />
        <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded" />
        <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border rounded" />
        <button class="w-full bg-green-600 text-white py-2 rounded" type="submit">Register</button>
      </form>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''
  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value }
    })
    localStorage.setItem('token', res.token)
    navigateTo('/rooms')
  } catch (e) {
    error.value = e?.data?.message || e.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-6 rounded shadow">
      <h1 class="text-2xl mb-4">Reset Password</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full p-2 border rounded"
          required
        />
        <button
          class="w-full bg-yellow-600 text-white py-2 rounded disabled:opacity-50"
          type="submit"
          :disabled="sending"
        >
          {{ sending ? 'Sending...' : 'Send OTP' }}
        </button>
      </form>
      <p v-if="result" class="text-green-600 mt-2">{{ result }}</p>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const email = ref('')
  const result = ref('')
  const error = ref('')
  const sending = ref(false)

  async function onSubmit() {
    result.value = ''
    error.value = ''
    sending.value = true
    try {
      const res = await $fetch('/api/auth/request-reset', {
        method: 'POST',
        body: { email: email.value },
      })
      result.value = 'OTP sent if account exists'
      navigateTo(`/verify-reset?email=${encodeURIComponent(email.value)}`)
    } catch (e) {
      error.value = e?.data?.statusMessage || e.message
    } finally {
      sending.value = false
    }
  }
</script>

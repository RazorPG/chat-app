<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-6 rounded shadow">
      <h1 class="text-2xl mb-4">Login</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full p-2 border rounded"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-2 border rounded"
        />
        <div class="flex items-center justify-between">
          <NuxtLink to="/register" class="text-sm text-blue-600"
            >Register</NuxtLink
          >
          <NuxtLink to="/forgot-password" class="text-sm text-blue-600"
            >Forgot?</NuxtLink
          >
        </div>
        <button
          class="w-full bg-blue-600 text-white py-2 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const email = ref('')
  const password = ref('')
  const error = ref('')

  definePageMeta({
    middleware: function () {
      // Allow access to login page
    },
  })

  async function onSubmit() {
    error.value = ''
    try {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: email.value, password: password.value },
      })

      console.log('Login response:', res)
      console.log('userId type:', typeof res.userId, 'value:', res.userId)

      // Check if OTP is required
      if (res.requireOtp) {
        // Store credentials temporarily for resend OTP
        try {
          sessionStorage.setItem('pendingEmail', email.value)
          sessionStorage.setItem('pendingPassword', password.value)
          sessionStorage.setItem('pendingUserId', res.userId) // Store userId
        } catch (e) {
          console.error('sessionStorage error:', e)
        }

        // Redirect to OTP verification page
        navigateTo(
          `/verify-otp?email=${encodeURIComponent(
            res.email
          )}&userId=${encodeURIComponent(res.userId)}`
        )
      } else {
        // Old flow (if OTP not enabled)
        localStorage.setItem('token', res.token)
        navigateTo('/rooms')
      }
    } catch (e) {
      error.value = e?.data?.message || e.message
    }
  }
</script>

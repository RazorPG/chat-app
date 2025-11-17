<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
  >
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h1>
        <p class="text-gray-600">Enter the 6-digit code sent to</p>
        <p class="text-indigo-600 font-medium">{{ email }}</p>
      </div>

      <form @submit.prevent="handleVerify" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >OTP Code</label
          >
          <input
            v-model="code"
            type="text"
            maxlength="6"
            placeholder="000000"
            class="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            required
            :disabled="verifying"
          />
        </div>

        <div
          v-if="error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="verifying || code.length !== 6"
          class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ verifying ? 'Verifying...' : 'Verify OTP' }}
        </button>

        <div class="text-center">
          <button
            type="button"
            @click="resendOtp"
            :disabled="resending || countdown > 0"
            class="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  const code = ref('')
  const email = ref('')
  const userId = ref('')
  const error = ref('')
  const verifying = ref(false)
  const resending = ref(false)
  const countdown = ref(60)
  let countdownInterval: any = null

  onMounted(() => {
    // Get email and userId from route query
    const route = useRoute()
    email.value = (route.query.email as string) || ''
    userId.value = (route.query.userId as string) || ''

    if (!email.value || !userId.value) {
      alert('Invalid verification request')
      navigateTo('/login')
      return
    }

    // Start countdown
    startCountdown()
  })

  onUnmounted(() => {
    if (countdownInterval) clearInterval(countdownInterval)
  })

  function startCountdown() {
    countdown.value = 60
    if (countdownInterval) clearInterval(countdownInterval)

    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
      }
    }, 1000)
  }

  async function handleVerify() {
    if (code.value.length !== 6) return

    error.value = ''
    verifying.value = true

    console.log('Verifying OTP with userId:', userId.value, 'code:', code.value)

    try {
      const response = await $fetch<{
        token: string
        user: { _id: string; name: string; email: string }
      }>('/api/auth/verify-otp', {
        method: 'POST',
        body: {
          userId: userId.value,
          code: code.value,
        },
      })

      // Save token and user data
      try {
        localStorage.setItem('token', response.token)
        localStorage.setItem('userId', response.user._id)
        localStorage.setItem('userName', response.user.name)
      } catch (e) {
        console.error('localStorage error:', e)
      }

      // Redirect to rooms
      navigateTo('/rooms')
    } catch (err: any) {
      error.value = err.data?.statusMessage || 'Verification failed'
    } finally {
      verifying.value = false
    }
  }

  async function resendOtp() {
    if (countdown.value > 0) return

    resending.value = true
    error.value = ''

    try {
      // Get email and password from session storage (if stored)
      const storedEmail = sessionStorage.getItem('pendingEmail')
      const storedPassword = sessionStorage.getItem('pendingPassword')

      if (!storedEmail || !storedPassword) {
        alert('Session expired. Please login again.')
        navigateTo('/login')
        return
      }

      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: storedEmail,
          password: storedPassword,
        },
      })

      // Restart countdown
      startCountdown()
      alert('OTP resent successfully!')
    } catch (err: any) {
      error.value = err.data?.statusMessage || 'Failed to resend OTP'
    } finally {
      resending.value = false
    }
  }
</script>

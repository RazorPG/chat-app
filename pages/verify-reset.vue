<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4"
  >
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-6" v-if="stage === 'otp'">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Verify Reset OTP</h1>
        <p class="text-gray-600">Enter the 6-digit code sent to</p>
        <p class="text-orange-600 font-medium break-all">{{ email }}</p>
      </div>
      <div class="text-center mb-6" v-else>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Set New Password</h1>
        <p class="text-gray-600">Enter your new password below</p>
      </div>

      <form
        v-if="stage === 'otp'"
        @submit.prevent="handleVerify"
        class="space-y-6"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >OTP Code</label
          >
          <input
            v-model="code"
            type="text"
            maxlength="6"
            placeholder="000000"
            class="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
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
          class="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ verifying ? 'Verifying...' : 'Verify OTP' }}
        </button>
        <div class="text-center">
          <button
            type="button"
            @click="resendOtp"
            :disabled="resending || countdown > 0"
            class="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP' }}
          </button>
        </div>
      </form>

      <form v-else @submit.prevent="handleSetPassword" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >New Password</label
          >
          <input
            v-model="newPassword"
            type="password"
            minlength="6"
            placeholder="Minimum 6 characters"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
            required
            :disabled="setting"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Confirm Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            minlength="6"
            placeholder="Repeat password"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
            required
            :disabled="setting"
          />
        </div>
        <div
          v-if="error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
        <div
          v-if="success"
          class="p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <p class="text-sm text-green-600">{{ success }}</p>
        </div>
        <button
          type="submit"
          :disabled="setting"
          class="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ setting ? 'Updating...' : 'Set Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  const email = ref('')
  const code = ref('')
  const error = ref('')
  const success = ref('')
  const verifying = ref(false)
  const resending = ref(false)
  const countdown = ref(60)
  const stage = ref<'otp' | 'set'>('otp')

  const newPassword = ref('')
  const confirmPassword = ref('')
  const setting = ref(false)

  let countdownInterval: any = null

  onMounted(() => {
    const route = useRoute()
    email.value = (route.query.email as string) || ''
    if (!email.value) {
      alert('Invalid reset request')
      navigateTo('/forgot-password')
      return
    }
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
      if (countdown.value <= 0) clearInterval(countdownInterval)
    }, 1000)
  }

  async function handleVerify() {
    error.value = ''
    success.value = ''
    if (code.value.length !== 6) return
    verifying.value = true
    try {
      const resp = await $fetch<{ verified: boolean }>(
        '/api/auth/verify-reset',
        {
          method: 'POST',
          body: { email: email.value, code: code.value },
        }
      )
      if (resp.verified) {
        stage.value = 'set'
      }
    } catch (e: any) {
      error.value = e?.data?.statusMessage || 'Verification failed'
    } finally {
      verifying.value = false
    }
  }

  async function resendOtp() {
    if (countdown.value > 0) return
    resending.value = true
    error.value = ''
    try {
      await $fetch('/api/auth/request-reset', {
        method: 'POST',
        body: { email: email.value },
      })
      startCountdown()
      alert('OTP resent')
    } catch (e: any) {
      error.value = e?.data?.statusMessage || 'Failed to resend OTP'
    } finally {
      resending.value = false
    }
  }

  async function handleSetPassword() {
    error.value = ''
    success.value = ''
    if (newPassword.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }
    setting.value = true
    try {
      const resp = await $fetch<{ success: boolean; message: string }>(
        '/api/auth/set-new-password',
        {
          method: 'POST',
          body: {
            email: email.value,
            code: code.value,
            newPassword: newPassword.value,
          },
        }
      )
      if (resp.success) {
        success.value = resp.message
        setTimeout(() => navigateTo('/login'), 2000)
      }
    } catch (e: any) {
      error.value = e?.data?.statusMessage || 'Failed to update password'
    } finally {
      setting.value = false
    }
  }
</script>

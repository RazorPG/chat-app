<template>
  <div
    class="relative flex items-center justify-center w-full min-h-screen p-4 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-emerald-950"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Green glow orbs -->
      <div
        class="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 blur-3xl animate-float"
      />
      <div
        class="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 blur-3xl animate-float-delayed"
      />
      <div
        class="absolute w-64 h-64 rounded-full top-1/2 right-1/3 bg-teal-500/10 blur-2xl animate-float-slow"
      />
    </div>

    <!-- Grid pattern overlay -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]"
    />

    <div class="relative z-10 w-full max-w-md animate-fade-in-up">
      <!-- Glassmorphism card -->
      <div
        class="p-8 border shadow-2xl bg-black/40 backdrop-blur-2xl border-emerald-500/20 rounded-3xl shadow-emerald-500/10 sm:p-10"
      >
        <!-- Back button -->
        <button
          @click="router.push('/login')"
          class="flex items-center gap-2 mb-6 transition-colors text-emerald-400 hover:text-emerald-300 group"
        >
          <svg
            class="w-4 h-4 transition-transform group-hover:-translate-x-1"
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
          <span>Back</span>
        </button>

        <!-- Logo and title -->
        <div class="flex flex-col items-center mb-8">
          <div
            class="relative p-4 mb-6 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-emerald-500/50 animate-scale-in"
          >
            <div
              class="absolute inset-0 opacity-50 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl blur"
            />
            <svg
              class="relative z-10 w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2c1.821 0 3.532.471 5.018 1.298M15 10l2 2m0 0l2-2m-2 2V6"
              />
            </svg>
          </div>

          <h1
            class="mb-2 text-3xl font-bold text-transparent text-white sm:text-4xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text"
          >
            Verify OTP
          </h1>
          <p class="text-center text-gray-400">
            Enter the 6-digit code sent to
          </p>
          <p class="px-4 mt-1 text-center break-all text-emerald-400">
            {{ email }}
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleVerify" class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium text-emerald-400">OTP Code</label>
            <input
              v-model="code"
              type="text"
              maxlength="6"
              placeholder="000000"
              class="w-full text-2xl font-bold tracking-widest text-center text-white transition-all border bg-black/30 border-emerald-500/30 placeholder:text-gray-500 focus:border-emerald-500 focus:bg-black/50 h-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
              :disabled="verifying"
            />
          </div>

          <button
            type="submit"
            :disabled="verifying || code.length !== 6"
            class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 h-12 sm:h-13 rounded-xl shadow-lg shadow-emerald-500/50 transition-all hover:shadow-emerald-500/70 hover:scale-[1.02] active:scale-[0.98] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ verifying ? 'Verifying...' : 'Verify OTP' }}
          </button>

          <div class="text-center">
            <span class="text-gray-400">Didn't receive the code? </span>
            <button
              type="button"
              @click="resendOtp"
              :disabled="resending || countdown > 0"
              class="transition-colors text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP' }}
            </button>
          </div>
        </form>

        <!-- Error message -->
        <div
          v-if="error"
          class="p-3 mt-4 border bg-red-500/10 border-red-500/30 rounded-xl animate-shake"
        >
          <p class="text-sm text-center text-red-400">{{ error }}</p>
        </div>
      </div>

      <!-- Bottom decorative line -->
      <div
        class="h-1 mt-4 rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scale-x"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  const code = ref('')
  const email = ref('')
  const userId = ref('')
  const error = ref('')
  const verifying = ref(false)
  const resending = ref(false)
  const countdown = ref(60)
  let countdownInterval: any = null

  onMounted(() => {
    email.value = (route.query.email as string) || ''
    userId.value = (route.query.userId as string) || ''

    if (!email.value || !userId.value) {
      alert('Invalid verification request')
      router.push('/login')
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
      router.push('/rooms')
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
        router.push('/login')
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
    } catch (err: any) {
      error.value = err.data?.statusMessage || 'Failed to resend OTP'
    } finally {
      resending.value = false
    }
  }
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

  @keyframes float-slow {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(50px, -30px);
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

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0) rotate(-180deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }

  @keyframes scaleX {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
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

  .animate-float-slow {
    animation: float-slow 12s ease-in-out infinite;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
  }

  .animate-scale-x {
    animation: scaleX 0.8s ease-out 0.5s both;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
</style>

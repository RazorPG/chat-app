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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>

          <h1
            class="mb-2 text-3xl font-bold text-transparent text-white sm:text-4xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text animate-fade-in"
          >
            Create Account
          </h1>
          <p class="text-gray-400 animate-fade-in-delayed">
            Join us and start chatting
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-5">
          <div class="space-y-2 animate-slide-in-left">
            <label for="name" class="text-sm font-medium text-emerald-400"
              >Name</label
            >
            <div class="relative">
              <svg
                class="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-emerald-500/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="Your name"
                class="w-full h-12 text-white transition-all border bg-black/30 border-emerald-500/30 placeholder:text-gray-500 focus:border-emerald-500 focus:bg-black/50 pl-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
          </div>

          <div class="space-y-2 animate-slide-in-left-delayed">
            <label for="email" class="text-sm font-medium text-emerald-400"
              >Email</label
            >
            <div class="relative">
              <svg
                class="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-emerald-500/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="your@email.com"
                class="w-full h-12 text-white transition-all border bg-black/30 border-emerald-500/30 placeholder:text-gray-500 focus:border-emerald-500 focus:bg-black/50 pl-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
          </div>

          <div class="space-y-2 animate-slide-in-left-delayed-2">
            <label for="password" class="text-sm font-medium text-emerald-400"
              >Password</label
            >
            <div class="relative">
              <svg
                class="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-emerald-500/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full h-12 text-white transition-all border bg-black/30 border-emerald-500/30 placeholder:text-gray-500 focus:border-emerald-500 focus:bg-black/50 pl-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
          </div>

          <div class="animate-fade-in-up-delayed">
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 h-12 sm:h-13 rounded-xl shadow-lg shadow-emerald-500/50 transition-all hover:shadow-emerald-500/70 hover:scale-[1.02] active:scale-[0.98] font-semibold"
            >
              Create Account
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

        <!-- Login link -->
        <div class="mt-8 text-center animate-fade-in-last">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-emerald-500/20"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 text-gray-400 bg-black/40">
                Already have an account?
              </span>
            </div>
          </div>
          <NuxtLink
            to="/login"
            class="inline-flex items-center gap-2 mt-4 transition-colors text-emerald-400 hover:text-emerald-300 group"
          >
            Sign in here
            <span class="transition-transform group-hover:translate-x-1"
              >→</span
            >
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom decorative line -->
      <div
        class="h-1 mt-4 rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scale-x"
      />
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
        body: {
          name: name.value,
          email: email.value,
          password: password.value,
        },
      })
      localStorage.setItem('token', res.token)
      navigateTo('/rooms')
    } catch (e) {
      error.value = e?.data?.message || e.message
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

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
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

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out 0.3s both;
  }

  .animate-fade-in-delayed {
    animation: fadeIn 0.5s ease-out 0.4s both;
  }

  .animate-fade-in-slow {
    animation: fadeIn 0.5s ease-out 0.7s both;
  }

  .animate-fade-in-up-delayed {
    animation: fadeInUp 0.5s ease-out 0.8s both;
  }

  .animate-fade-in-last {
    animation: fadeIn 0.5s ease-out 0.9s both;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out 0.5s both;
  }

  .animate-slide-in-left-delayed {
    animation: slideInLeft 0.5s ease-out 0.6s both;
  }

  .animate-slide-in-left-delayed-2 {
    animation: slideInLeft 0.5s ease-out 0.7s both;
  }

  .animate-scale-in {
    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
  }

  .animate-scale-x {
    animation: scaleX 0.8s ease-out 1s both;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
</style>

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-11-29',
  modules: ['@nuxtjs/tailwindcss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'change-me',
    cloudinaryUrl: process.env.CLOUDINARY_URL || '',
    pusherAppId: process.env.PUSHER_APP_ID || '',
    pusherKey: process.env.PUSHER_KEY || '',
    pusherSecret: process.env.PUSHER_SECRET || '',
    pusherCluster: process.env.PUSHER_CLUSTER || '',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@chatapp.com',
  },
})

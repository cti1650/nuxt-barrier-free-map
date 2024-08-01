import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],

  build: {
    transpile: ['vuetify', '@googlemaps/js-api-loader']
  },

  plugins: [
    '~/plugins/firebase.ts'
  ],

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  runtimeConfig: {
    public: {
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        appId: process.env.FIREBASE_APP_ID
      },
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  },

  typescript: {
    strict: true
  },

  ssr: false,
  compatibilityDate: '2024-08-01',
})
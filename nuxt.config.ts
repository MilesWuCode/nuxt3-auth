// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
  ],

  eslint: {
    // 啟動時檢查代碼,建議開
    lintOnStart: true,
  },

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET,
  },

  auth: {
    baseURL: process.env.NUXT_PUBLIC_WEB_URL,
    provider: {
      type: 'authjs',
    },
  },
})

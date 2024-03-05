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
    authSecret: process.env.AUTH_SECRET,
    apiUrl: process.env.NUXT_API_URL,
    passwordClientId: process.env.NUXT_PASSWORD_CLIENT_ID,
    passwordClientSecret: process.env.NUXT_PASSWORD_CLIENT_SECRET,
    public: {
      testAccount: process.env.NUXT_TEST_ACCOUNT,
      testPassword: process.env.NUXT_TEST_PASSWORD,
    },
  },

  auth: {
    baseURL: process.env.NUXT_PUBLIC_WEB_URL,
    provider: {
      type: 'authjs',
    },
  },
})

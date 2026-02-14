// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxthub/core',
    '@onmax/nuxt-better-auth',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/login': { auth: 'guest' },
    '/signup': { auth: 'guest' },
    '/app/**': { auth: 'user' }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  hub: {
    db: 'sqlite',
    kv: true
  },

  auth: {
    redirects: {
      login: '/login',
      guest: '/app'
    },
    secondaryStorage: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

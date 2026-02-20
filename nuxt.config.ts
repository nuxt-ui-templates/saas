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

  runtimeConfig: {
    githubClientId: '',
    githubClientSecret: ''
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/login': { auth: { only: 'guest' } },
    '/signup': { auth: { only: 'guest' } },
    '/app/**': { auth: 'user' }
  },

  compatibilityDate: '2026-02-19',

  nitro: {
    preset: 'cloudflare-module',
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
    hubSecondaryStorage: true,
    redirects: {
      login: '/login',
      guest: '/app',
      authenticated: '/app',
      logout: '/'
    }
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

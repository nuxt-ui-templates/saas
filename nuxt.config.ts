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
    '/login': { auth: { only: 'guest', redirectTo: '/app' } },
    '/signup': { auth: { only: 'guest', redirectTo: '/app' } },
    '/app/**': { auth: { only: 'user', redirectTo: '/login' } }
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
    db: 'sqlite'
  },

  auth: {
    secondaryStorage: true,
    redirects: { logout: '/' }
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

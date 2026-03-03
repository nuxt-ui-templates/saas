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
    githubClient: {
      id: '',
      secret: ''
    },
    polar: {
      accessToken: '',
      productId: '',
      returnUrl: ''
    },
    public: {
      polar: {
        productSlug: 'pro'
      }
    }
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/login': { auth: { only: 'guest' }, prerender: false },
    '/signup': { auth: { only: 'guest' }, prerender: false },
    '/app': { auth: 'user', prerender: false }
  },

  compatibilityDate: '2026-02-19',

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

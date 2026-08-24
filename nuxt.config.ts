// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxtjs/better-auth',
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

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  runtimeConfig: {
    githubClient: {
      id: '',
      secret: ''
    },
    freeTodoLimit: 3,
    polar: {
      accessToken: '',
      returnUrl: ''
    },
    public: {
      polar: {
        productId: '',
        productSlug: 'pro'
      }
    }
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/login': { auth: { only: 'guest' }, prerender: false },
    '/signup': { auth: { only: 'guest' }, prerender: false },
    '/app': { auth: 'user', prerender: false },
    '/app/**': { auth: 'user', prerender: false }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  hub: {
    db: process.env.POSTGRES_URL
      ? { dialect: 'postgresql', driver: 'postgres-js' }
      : 'sqlite'
  },

  auth: {
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
  },

  ogImage: {
    zeroRuntime: true
  }
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
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
    // v4 serves the native `content.get()` / `content.list()` / `content.navigation()` API, but has
    // no equivalent for three v3 features this template uses, so the v3 compatibility layer stays
    // on for them: search sections (`queryCollectionSearchSections`, `UContentSearch`), prev/next
    // links (`queryCollectionItemSurroundings`) and the `<MDC>` component (hero title).
    v3Composables: true,
    build: {
      markdown: {
        // v4 highlights only when configured, where v3's `@nuxtjs/mdc` did it by default, and
        // Nuxt UI hands its themes to `mdc.highlight`, which v4 doesn't read. Same themes, until
        // Nuxt UI configures the v4 option itself.
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight'
          }
        }
      }
    }
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },

  compatibilityDate: '2026-06-30',

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
  },

  prerender: {
    routes: [
      '/'
    ],
    crawlLinks: true
  }
})

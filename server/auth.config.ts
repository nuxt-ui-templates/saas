import { defineServerAuth } from '@nuxtjs/better-auth/config'

export default defineServerAuth(({ runtimeConfig }) => ({
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: runtimeConfig.githubClient?.id ?? '',
      clientSecret: runtimeConfig.githubClient?.secret ?? ''
    }
  }
}))

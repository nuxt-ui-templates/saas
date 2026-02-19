import { defineServerAuth } from '@onmax/nuxt-better-auth/config'

export default defineServerAuth(({ runtimeConfig }) => ({
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: runtimeConfig.githubClientId,
      clientSecret: runtimeConfig.githubClientSecret
    }
  }
}))

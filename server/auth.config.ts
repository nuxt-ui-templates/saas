import { defineServerAuth } from '@onmax/nuxt-better-auth/config'

export default defineServerAuth(({ runtimeConfig }) => {
  const authRuntimeConfig = runtimeConfig as {
    githubClientId?: string
    githubClientSecret?: string
  }

  return {
    emailAndPassword: {
      enabled: true
    },
    socialProviders: {
      github: {
        clientId: authRuntimeConfig.githubClientId as string,
        clientSecret: authRuntimeConfig.githubClientSecret as string
      }
    }
  }
})

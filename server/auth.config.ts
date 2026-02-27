import { defineServerAuth } from '@onmax/nuxt-better-auth/config'
import { checkout, polar, portal } from '@polar-sh/better-auth'
import { Polar } from '@polar-sh/sdk'

export default defineServerAuth(({ runtimeConfig }) => {
  return {
    emailAndPassword: {
      enabled: true
    },
    account: {
      accountLinking: {
        enabled: true
      }
    },
    socialProviders: {
      github: {
        clientId: runtimeConfig.githubClient?.id ?? '',
        clientSecret: runtimeConfig.githubClient?.secret ?? ''
      }
    },
    plugins: [
      polar({
        client: new Polar({
          accessToken: runtimeConfig.polar?.accessToken ?? '',
          server: 'sandbox'
        }),
        createCustomerOnSignUp: true,
        use: [
          checkout({
            products: [{
              productId: runtimeConfig.polar?.productId ?? '',
              slug: runtimeConfig.public?.polar?.productSlug ?? 'pro'
            }],
            successUrl: '/app?checkout=success',
            authenticatedUsersOnly: true,
            returnUrl: runtimeConfig.polar?.returnUrl ?? ''
          }),
          portal({
            returnUrl: runtimeConfig.polar?.returnUrl ?? ''
          })
        ]
      })
    ]
  }
})

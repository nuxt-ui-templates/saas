import { defineClientAuth } from '@onmax/nuxt-better-auth/config'
import { polarClient } from '@polar-sh/better-auth/client'

export default defineClientAuth({
  plugins: [polarClient()]
})

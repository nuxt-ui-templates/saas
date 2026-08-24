import { defineClientAuth } from '@nuxtjs/better-auth/config'
import { polarClient } from '@polar-sh/better-auth/client'

export default defineClientAuth({
  plugins: [polarClient()]
})

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const configured = Boolean(runtimeConfig.polarAccessToken && runtimeConfig.polarProductId)

  return {
    checkoutEnabled: configured,
    portalEnabled: configured,
    webhooksEnabled: configured && Boolean(runtimeConfig.polarWebhookSecret)
  }
})

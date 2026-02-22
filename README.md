# Nuxt SaaS Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Fully built SaaS application to launch your next project with a landing page, a pricing page, a documentation and a blog powered by [Nuxt UI](https://ui.nuxt.com) components.

- [Live demo](https://saas-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt)

<a href="https://saas-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ui.nuxt.com/assets/templates/nuxt/saas-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://ui.nuxt.com/assets/templates/nuxt/saas-light.png">
    <img alt="Nuxt SaaS Template" src="https://ui.nuxt.com/assets/templates/nuxt/saas-light.png">
  </picture>
</a>

## Quick Start

```bash [Terminal]
npm create nuxt@latest -- -t github:nuxt-ui-templates/saas
```

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=saas&repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fsaas&env=NUXT_BETTER_AUTH_SECRET&envDescription=Better%20Auth%20secret%20key%20(min%2032%20chars).%20Generate%20with%20%60openssl%20rand%20-base64%2032%60&envLink=https%3A%2F%2Fbetter-auth.nuxt.dev%2Fgetting-started%2Finstallation&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22database%22%2C%22integrationSlug%22%3A%22tursocloud%22%7D%5D&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fsaas-dark.png&demo-url=https%3A%2F%2Fsaas-template.nuxt.dev%2F&demo-title=Nuxt%20SaaS%20Template&demo-description=A%20SaaS%20template%20with%20landing%2C%20pricing%2C%20docs%20and%20blog%20powered%20by%20Nuxt%20Content.)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

### Authentication

This template uses [Better Auth](https://www.better-auth.com/) via [`@onmax/nuxt-better-auth`](https://better-auth.nuxt.dev) for authentication with email and password enabled by default.

Generate a secret key and set it in your `.env`:

```bash
# Generate a secret (min 32 characters)
openssl rand -base64 32
```

```bash
NUXT_BETTER_AUTH_SECRET=<your-generated-secret>
```

### Polar Sandbox Billing (Optional)

This template supports subscription checkout and customer portal flows via [Polar](https://polar.sh) using the Better Auth plugin: [@polar-sh/better-auth](https://www.npmjs.com/package/@polar-sh/better-auth).

Use Polar Sandbox credentials so template users can test upgrades with fake payment data.

```bash
NUXT_POLAR_ACCESS_TOKEN=<polar-sandbox-access-token>
NUXT_POLAR_WEBHOOK_SECRET=<polar-sandbox-webhook-secret>
NUXT_POLAR_PRODUCT_ID=<polar-sandbox-product-id>
NUXT_PUBLIC_POLAR_PRODUCT_SLUG=pro
```

Behavior:

- free mode by default: leave Polar env vars (or `NUXT_PUBLIC_POLAR_PRODUCT_SLUG`) empty to hide billing actions
- enabled billing: set `NUXT_POLAR_ACCESS_TOKEN`, `NUXT_POLAR_PRODUCT_ID`, and `NUXT_PUBLIC_POLAR_PRODUCT_SLUG` to enable checkout and portal actions (`NUXT_POLAR_WEBHOOK_SECRET` is optional for webhooks)

Webhook endpoint for Polar:

`/api/auth/polar/webhooks`

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Deploy to Cloudflare Worker (uses bindings from `wrangler.jsonc`):

```bash
pnpm deploy
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.

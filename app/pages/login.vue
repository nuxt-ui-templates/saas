<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const toast = useToast()

const fields = [{
  name: 'email',
  size: 'xl' as const,
  type: 'text' as const,
  label: 'Email',
  placeholder: 'you@company.com'
}, {
  name: 'password',
  size: 'xl' as const,
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password'
}, {
  name: 'remember',
  size: 'xl' as const,
  label: 'Remember me',
  type: 'checkbox' as const
}]

const providers = [{
  label: 'Continue with GitHub',
  size: 'xl' as const,
  variant: 'outline' as const,
  icon: 'i-simple-icons-github',
  class: 'py-[11px] text-[15px]/6',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
  }
}, {
  label: 'Email me a magic link',
  size: 'xl' as const,
  variant: 'outline' as const,
  icon: 'i-lucide-mail',
  class: 'py-[11px] text-[15px]/6',
  onClick: () => {
    toast.add({ title: 'Magic link', description: 'Check your inbox for a sign in link' })
  }
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    title="Welcome back."
    :submit="{ label: 'Sign in', color: 'neutral', size: 'xl' }"
    :separator="{ label: 'or', ui: { label: 'font-mono text-xs font-normal uppercase tracking-[0.04em] text-dimmed' } }"
    @submit="onSubmit"
  >
    <template #description>
      Don't have an account? <ULink
        to="/signup"
        class="text-highlighted font-medium underline decoration-(--ui-border-accented) underline-offset-4 hover:decoration-current"
      >Sign up</ULink>
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-muted hover:text-highlighted"
        tabindex="-1"
      >Forgot password?</ULink>
    </template>

    <template #footer>
      By signing in, you agree to our <ULink
        to="/"
        class="text-toned underline decoration-(--ui-border-accented) underline-offset-4 hover:text-highlighted hover:decoration-current"
      >Terms of Service</ULink> and <ULink
        to="/"
        class="text-toned underline decoration-(--ui-border-accented) underline-offset-4 hover:text-highlighted hover:decoration-current"
      >Privacy Policy</ULink>.
    </template>
  </UAuthForm>
</template>

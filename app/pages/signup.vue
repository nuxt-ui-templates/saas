<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign up',
  description: 'Create an account to get started'
})

const toast = useToast()

const fields = [{
  name: 'name',
  size: 'xl' as const,
  type: 'text' as const,
  label: 'Name',
  placeholder: 'Enter your name'
}, {
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
  name: z.string().min(1, 'Name is required'),
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
    title="Create an account."
    :submit="{ label: 'Create account', color: 'neutral', size: 'xl' }"
    :separator="{ label: 'or', ui: { label: 'font-mono text-xs font-normal uppercase tracking-[0.04em] text-dimmed' } }"
    @submit="onSubmit"
  >
    <template #description>
      Already have an account? <ULink
        to="/login"
        class="text-highlighted font-medium underline decoration-(--ui-border-accented) underline-offset-4 hover:decoration-current"
      >Sign in</ULink>
    </template>

    <template #footer>
      By signing up, you agree to our <ULink
        to="/"
        class="text-toned underline decoration-(--ui-border-accented) underline-offset-4 hover:text-highlighted hover:decoration-current"
      >Terms of Service</ULink> and <ULink
        to="/"
        class="text-toned underline decoration-(--ui-border-accented) underline-offset-4 hover:text-highlighted hover:decoration-current"
      >Privacy Policy</ULink>.
    </template>
  </UAuthForm>
</template>

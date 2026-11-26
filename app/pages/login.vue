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
  placeholder: 'you@company.com',
  required: true
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
  label: 'Continue with Google',
  size: 'xl' as const,
  variant: 'outline' as const,
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Login with Google' })
  }
}, {
  label: 'Continue with GitHub',
  size: 'xl' as const,
  variant: 'outline' as const,
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
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
    :separator="{ label: 'or', ui: { label: 'font-mono text-xs uppercase tracking-wider text-dimmed' } }"
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

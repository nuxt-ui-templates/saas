<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AppAuthClient } from '#nuxt-better-auth'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const toast = useToast()
const signInEmail = useUserSignIn('email')
const signInSocial = useUserSignIn('social')
const isSignInPending = computed(() => signInEmail.status.value === 'pending')
const isSocialSignInPending = computed(() => signInSocial.status.value === 'pending')

const fields = [{
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password'
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox' as const
}]

const providers = computed(() => [{
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  loading: isSocialSignInPending.value,
  disabled: isSocialSignInPending.value,
  onClick: () => onSignIn('github')
}])

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>
type SocialProvider = Parameters<NonNullable<AppAuthClient>['signIn']['social']>[0]['provider']

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  await signInEmail.execute({
    email: payload.data.email,
    password: payload.data.password
  })

  if (signInEmail.status.value === 'error') {
    toast.add({
      color: 'error',
      title: 'Login failed',
      description: signInEmail.error.value?.message ?? 'Please try again.'
    })
  }
}

function formatProvider(provider: SocialProvider) {
  return provider.charAt(0).toUpperCase() + provider.slice(1)
}

async function onSignIn(provider: SocialProvider) {
  await signInSocial.execute({
    provider,
    callbackURL: '/app',
    newUserCallbackURL: '/app'
  })

  if (signInSocial.status.value === 'error') {
    toast.add({
      color: 'error',
      title: `${formatProvider(provider)} login failed`,
      description: signInSocial.error.value?.message ?? 'Please try again.'
    })
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    title="Welcome back"
    icon="i-lucide-lock"
    :loading="isSignInPending"
    :disabled="isSignInPending"
    @submit="onSubmit"
  >
    <template #description>
      Don't have an account? <ULink
        to="/signup"
        class="text-primary font-medium"
      >Sign up</ULink>.
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
      >Forgot password?</ULink>
    </template>

    <template #footer>
      By signing in, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
      >Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>

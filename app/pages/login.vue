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
const signInEmail = useUserSignIn().email
const route = useRoute()

const pending = computed(() => signInEmail.pending.value)

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

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  disabled: true
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  disabled: true
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const redirectTo = computed(() => {
  const q = route.query.redirect
  if (typeof q === 'string' && q.startsWith('/')) {
    return q
  }
  return '/app'
})

function getErrorMessage(error: unknown) {
  if (!error) {
    return null
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Please try again.'
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await signInEmail.execute({
      email: payload.data.email,
      password: payload.data.password
    }, {
      onSuccess: async () => { await navigateTo(redirectTo.value) }
    })

    const resultError = getErrorMessage(signInEmail.error.value)
    if (resultError) {
      toast.add({
        color: 'error',
        title: 'Login failed',
        description: resultError
      })
    }
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Login failed',
      description: getErrorMessage(error) ?? 'Please try again.'
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
    :loading="pending"
    :disabled="pending"
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

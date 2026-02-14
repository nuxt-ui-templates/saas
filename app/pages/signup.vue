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
const { signUp } = useUserSession()

const pending = ref(false)

const fields = [{
  name: 'name',
  type: 'text' as const,
  label: 'Name',
  placeholder: 'Enter your name'
}, {
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email'
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password'
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
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  pending.value = true
  try {
    await signUp.email({
      name: payload.data.name,
      email: payload.data.email,
      password: payload.data.password
    }, {
      onSuccess: () => { navigateTo('/app') }
    })
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Sign up failed',
      description: error instanceof Error ? error.message : 'Please try again.'
    })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    title="Create an account"
    :submit="{ label: 'Create account' }"
    :loading="pending"
    :disabled="pending"
    @submit="onSubmit"
  >
    <template #description>
      Already have an account? <ULink
        to="/login"
        class="text-primary font-medium"
      >Login</ULink>.
    </template>

    <template #footer>
      By signing up, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
      >Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>

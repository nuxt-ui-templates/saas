export function useGitHubProvider() {
  const toast = useToast()
  const signIn = useSignIn('social')

  return computed(() => [{
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    loading: signIn.status.value === 'pending',
    onClick: async () => {
      await signIn.execute({ provider: 'github' })

      if (signIn.error.value) {
        toast.add({
          color: 'error',
          title: 'GitHub sign-in failed',
          description: signIn.error.value.message || 'Please try again.'
        })
      }
    }
  }])
}
